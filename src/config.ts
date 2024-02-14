import { ExternalAccountClientOptions } from 'google-auth-library';

export const REPLIT_SIDECAR_ENDPOINT = 'http://0.0.0.0:1106';
export const REPLIT_DEFAULT_BUCKET_URL =
  REPLIT_SIDECAR_ENDPOINT + '/object-storage/default-bucket';

const REPLIT_CREDENTIAL_URL = REPLIT_SIDECAR_ENDPOINT + '/credential';
const REPLIT_TOKEN_URL = REPLIT_SIDECAR_ENDPOINT + '/token';

export const REPLIT_ADC: ExternalAccountClientOptions = {
  audience: 'replit',
  subject_token_type: 'access_token',
  token_url: REPLIT_TOKEN_URL,
  type: 'replit',
  credential_source: {
    url: REPLIT_CREDENTIAL_URL,
    format: {
      type: 'json',
      subject_token_field_name: 'access_token',
    },
  },
};
