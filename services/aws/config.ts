import { AWSCredentials } from '@/types/aws';
import { CredentialsService } from '@/services/aws/credentials';

export async function getAWSConfig(): Promise<AWSCredentials|null> {
  try {
    const credentials = await CredentialsService.getCredentials();
    if(!credentials) {
      console.warn("No AWS Credentials found");
      return null;
    }

    return credentials;
  } catch (error) {
    console.error("error getting aws config: ", error);
    return null;
  }
}

export async function getAWSConfigForRegion(region: string) {
  const config = await getAWSConfig();
  if(!config) return null;

  return {
    ...config,
    region
  }
}