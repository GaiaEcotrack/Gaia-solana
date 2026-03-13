import { Controller, Post, Get, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { SolanaService } from './solana.service';

@Controller('solana')
export class SolanaController {
  constructor(private readonly solanaService: SolanaService) {}

  /**
   * Endpoint GET /solana/account/:pubkey
   * Sirve para que el frontend consulte el estado de una cuenta de Solana de forma rápida,
   * sin cargar toda la lógica de Web3.js en el cliente pesado.
   */
  @Get('account/:pubkey')
  async getAccount(@Param('pubkey') pubkey: string) {
    try {
      const info = await this.solanaService.getAccountInfo(pubkey);
      if (!info) {
        throw new HttpException('Cuenta no encontrada', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: {
          lamports: info.lamports,
          owner: info.owner.toBase58(),
          executable: info.executable,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Endpoint POST /solana/execute/mint
   * El frontend pide al backend que construya la transacción de minteo de Tokens.
   */
  @Post('execute/mint')
  async buildMintExecutionTx(@Body('userPublicKey') userPublicKey: string, @Body('amount') amount: number) {
    if (!userPublicKey || amount === undefined || amount <= 0) {
      throw new HttpException('Se requiere el userPublicKey y una cantidad (amount) válida mayor a 0', HttpStatus.BAD_REQUEST);
    }

    try {
      // Llamamos a la lógica actualizada de Anchor
      const base64Tx = await this.solanaService.buildMintTransaction(userPublicKey, amount);
      
      return {
        success: true,
        transactionBase64: base64Tx,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Endpoint POST /solana/execute/send
   * El frontend recibe la TX firmada del usuario en Phantom y el backend la envía.
   */
  @Post('execute/send')
  async sendExecutionTx(@Body('signedTxBase64') signedTxBase64: string) {
    if (!signedTxBase64) {
      throw new HttpException('Se requiere la firmada signedTxBase64', HttpStatus.BAD_REQUEST);
    }

    try {
      const signature = await this.solanaService.sendAndConfirmTransaction(signedTxBase64);
      return {
        success: true,
        signature,
        message: 'Transacción procesada correctamente en la Blockchain',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
