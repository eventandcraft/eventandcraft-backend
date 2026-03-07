import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import firebaseConfig from 'src/config/firebase.config';
import { FirebaseService } from './firebase.service';
import { FirebaseStorageService } from './firebase-storage.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(firebaseConfig)],
  providers: [FirebaseService, FirebaseStorageService],
  exports: [FirebaseService, FirebaseStorageService], // Export services globally
})
export class FirebaseModule {}
