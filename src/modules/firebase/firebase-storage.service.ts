import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from './firebase.service';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseStorageService {
  private readonly logger = new Logger(FirebaseStorageService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly firebaseService: FirebaseService,
  ) {}

  /**
   * Uploads a file to Firebase Cloud Storage.
   * @param fileBuffer - Buffer containing file data
   * @param originalName - Name of the file being uploaded
   * @param mimetype - MIME type of the file
   * @returns Public URL of the uploaded file
   */
  async uploadFile(fileBuffer: Buffer, originalName: string, mimetype: string): Promise<string> {
    try {
      const storage = this.firebaseService.getStorage();
      const bucketName = this.configService.get<string>('firebase.storageBucket');
      
      if (!bucketName) {
        throw new InternalServerErrorException('Storage bucket configuration is missing');
      }

      const bucket = storage.bucket(bucketName);
      const uniqueFileName = `${Date.now()}-${originalName}`;
      const file = bucket.file(uniqueFileName);

      await file.save(fileBuffer, {
        metadata: {
          contentType: mimetype,
        },
        public: true, // Make the file publicly readable by default or handle signed URLs
      });

      this.logger.log(`File uploaded successfully: ${uniqueFileName}`);

      // We form the public URL if it's publicly reading enabled.
      // Alternatively, use `await file.getSignedUrl({ ... })` if you want a restricted/signed URL
      return `https://storage.googleapis.com/${bucketName}/${uniqueFileName}`;
    } catch (error) {
      this.logger.error(`Error uploading file to Firebase Storage`, error);
      throw new InternalServerErrorException('Could not upload file');
    }
  }

  /**
   * Deletes a file from Firebase Cloud Storage by its url
   * @param fileUrl - The url of the file to delete
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const storage = this.firebaseService.getStorage();
      const bucketName = this.configService.get<string>('firebase.storageBucket');
      
      if (!bucketName) {
        throw new InternalServerErrorException('Storage bucket configuration is missing');
      }

      const bucket = storage.bucket(bucketName);
      
      // Extract file name from url
      const fileNameMatch = fileUrl.split(`${bucketName}/`);
      if (fileNameMatch.length < 2) {
        throw new Error('Invalid file URL format');
      }

      const uniqueFileName = fileNameMatch[1];
      const file = bucket.file(uniqueFileName);

      await file.delete();
      this.logger.log(`File deleted successfully: ${uniqueFileName}`);
    } catch (error) {
      this.logger.error(`Error deleting file from Firebase Storage: ${fileUrl}`, error);
      throw new InternalServerErrorException('Could not delete file');
    }
  }

  /**
   * Retrieves a signed URL to read a file
   * @param fileName - File name to retrieve url
   */
  async getSignedUrl(fileName: string): Promise<string> {
    try {
      const storage = this.firebaseService.getStorage();
      const bucketName = this.configService.get<string>('firebase.storageBucket');

      if (!bucketName) {
        throw new InternalServerErrorException('Storage bucket configuration is missing');
      }

      const bucket = storage.bucket(bucketName);
      const file = bucket.file(fileName);

      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // Valid for 15 minutes
      });

      return url;
    } catch (error) {
      this.logger.error(`Error generating signed URL: ${fileName}`, error);
      throw new InternalServerErrorException('Could not generate signed URL');
    }
  }
}
