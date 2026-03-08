import { Module, Global } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { FirebaseStorageService } from '../firebase/firebase-storage.service';
import { FileStorageService } from './storage.service';

@Global()
@Module({
  imports: [FirebaseModule],
  providers: [
    {
      provide: FileStorageService,
      useExisting: FirebaseStorageService,
    },
  ],
  exports: [FileStorageService],
})
export class StorageModule {}
