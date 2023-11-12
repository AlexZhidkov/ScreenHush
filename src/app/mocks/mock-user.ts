import { User } from '@angular/fire/auth';

export const mockUser: User = {
  uid: 'mockUserId',
  displayName: 'Mock User',
  email: 'mockuser@example.com',
  emailVerified: true,
  isAnonymous: false,
  metadata: {
    creationTime: 'mockCreationTime',
    lastSignInTime: 'mockLastSignInTime',
  },
  providerData: [
    {
      uid: 'mockProviderUserId',
      displayName: 'Mock Provider User',
      email: 'mockprovideruser@example.com',
      photoURL: 'mockPhotoURL',
      providerId: 'mockProviderId',
      phoneNumber: 'mocknumber',
    },
  ],
  refreshToken: 'mockRefreshToken',
  tenantId: 'mockTenantId',
  delete: async () => {
    // Implementation for delete method, if needed
  },
  getIdToken: async (forceRefresh?: boolean) => {
    // Implementation for getIdToken method, if needed
    return 'mockIdToken';
  },
  getIdTokenResult: async (forceRefresh?: boolean | undefined) => {
    // Implementation for getIdTokenResult method, if needed
    return {
      authTime: 'mockAuthTime',
      expirationTime: 'mockExpirationTime',
      issuedAtTime: 'mockIssuedAtTime',
      signInProvider: 'mockSignInProvider',
      signInSecondFactor: 'mockSignInSecondFactor',
      token: 'mockToken',
      claims: {
        // Your mocked claims object goes here
        uid: 'mockUid',
        email: 'mockuser@example.com',
        // ... other mocked claims
      },
    };
  },
  reload: async () => {
    // Implementation for reload method, if needed
  },
  phoneNumber: null, // Add these properties to satisfy the User interface
  photoURL: 'mockPhotoURL',
  providerId: 'mockProviderId',
  toJSON: () => {
    // Implementation for toJSON method, if needed
    return {
      uid: 'mockUserId',
      displayName: 'Mock User',
      email: 'mockuser@example.com',
      // ... other properties
    };
  },
};
