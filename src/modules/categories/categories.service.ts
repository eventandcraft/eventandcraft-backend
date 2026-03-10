import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private categoryModel: typeof Category) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoryModel.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with name ${createCategoryDto.name} already exists`,
      );
    }

    if (createCategoryDto.parentId) {
      const parent = await this.categoryModel.findByPk(
        createCategoryDto.parentId,
      );
      if (!parent) {
        throw new NotFoundException(
          `Parent category with ID ${createCategoryDto.parentId} not found`,
        );
      }
    }

    return this.categoryModel.create({ ...createCategoryDto });
  }

  async findAll() {
    return this.categoryModel.findAll({
      where: { parentId: null as any },
      include: [{ model: Category, as: 'children' }],
    });
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findByPk(id, {
      include: [{ model: Category, as: 'children' }],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryModel.findOne({
        where: { name: updateCategoryDto.name },
      });
      if (existingCategory) {
        throw new ConflictException(
          `Category with name ${updateCategoryDto.name} already exists`,
        );
      }
    }

    if (updateCategoryDto.parentId) {
      if (updateCategoryDto.parentId === id) {
        throw new ConflictException('A category cannot be its own parent');
      }
      const parent = await this.categoryModel.findByPk(
        updateCategoryDto.parentId,
      );
      if (!parent) {
        throw new NotFoundException(
          `Parent category with ID ${updateCategoryDto.parentId} not found`,
        );
      }
    }

    await category.update(updateCategoryDto);
    return category;
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    // Check if category has children
    const children = await this.categoryModel.count({
      where: { parentId: id },
    });
    if (children > 0) {
      throw new ConflictException(
        'Cannot delete a category that has children. Delete or reassign children first.',
      );
    }

    await category.destroy();
    return { success: true, message: 'Category deleted successfully' };
  }
}
