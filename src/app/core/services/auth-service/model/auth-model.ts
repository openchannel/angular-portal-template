
export interface ClaimsMappings {
    emailField?: string;
    firstNameField?: string;
    lastNameField?: string;
    organizationId?: string;
    companyName?: string;
}

export interface AuthConfig {
    type?: string;
    clientId?: string;
    issuer?: string;
    grantType?: string;
    scope?: string;
    redirectUri?: string;
    strictDiscoveryDocumentValidation?: any;
    claimsMappings?: ClaimsMappings;
}

export interface RefreshJwtTokenRequest {
    refreshToken: string;
}

export interface LoginRequest {
    idToken?: string;
    accessToken?: string;
}

export class LoginResponse {
    accessToken?: string;
    refreshToken?: string;
}



