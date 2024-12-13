import { IPixIntegration } from "../../application/useCases/campaign/create/protocols";

export class PixIntegrationEfi implements IPixIntegration {
  async generatePixQRCode(pixKey: string): Promise<string> {
    const qrcode = `https://example.com/qrcode/${pixKey}`;
    
    return qrcode;
  };
};

