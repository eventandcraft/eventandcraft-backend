import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.initializeFirebase();
  }

  /**
   * Initializes the Firebase Admin SDK if not already initialized
   */
  private initializeFirebase() {
    if (admin.apps.length === 0) {
      const projectId = this.configService.get<string>('firebase.projectId');
      const clientEmail = this.configService.get<string>(
        'firebase.clientEmail',
      );
      const privateKey = this.configService.get<string>('firebase.privateKey');

      if (!projectId || !clientEmail || !privateKey) {
        this.logger.warn(
          'Firebase configuration is missing! Please set in .env',
        );
        return;
      }

      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
        this.logger.log('Firebase App initialized successfully.');
      } catch (error) {
        this.logger.error('Error initializing Firebase App', error);
      }
    }
  }

  /**
   * Retrieves the Firebase Auth instance
   * @returns admin.auth.Auth
   */
  getAuth(): admin.auth.Auth {
    return admin.auth();
  }

  /**
   * Retrieves the Firebase Firestore instance
   * @returns admin.firestore.Firestore
   */
  getFirestore(): admin.firestore.Firestore {
    return admin.firestore();
  }

  /**
   * Retrieves the Firebase Storage instance
   * Typically, dedicated storage logic goes to FirebaseStorageService
   * @returns admin.storage.Storage
   */
  getStorage(): admin.storage.Storage {
    return admin.storage();
  }
}
