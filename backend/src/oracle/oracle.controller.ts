import { Controller, Get, Post, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OracleService } from './oracle.service';
import { SignReportDto, SignedReportResponseDto } from './dto/sign-report.dto';

@ApiTags('oracle')
@Controller('api/oracle')
@UsePipes(new ValidationPipe({ transform: true }))
export class OracleController {
    constructor(private readonly oracleService: OracleService) { }

    @Post('sign')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sign an energy report' })
    @ApiBody({ type: SignReportDto })
    @ApiResponse({
        status: 200,
        description: 'Report signed successfully',
        type: SignedReportResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid report data',
    })
    async signReport(@Body() signReportDto: SignReportDto): Promise<SignedReportResponseDto> {
        return this.oracleService.signEnergyReport(signReportDto);
    }

    @Post('verify')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify a signature' })
    @ApiResponse({
        status: 200,
        description: 'Signature verification result',
        schema: {
            type: 'object',
            properties: {
                valid: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    })
    async verifySignature(
        @Body()
        body: {
            reportData: SignReportDto;
            reportId: string;
            signature: string;
            oraclePublicKey: string;
        },
    ) {
        const isValid = await this.oracleService.verifySignature(
            body.reportData,
            body.reportId,
            body.signature,
            body.oraclePublicKey,
        );

        return {
            valid: isValid,
            message: isValid ? 'Signature is valid' : 'Signature is invalid',
        };
    }

    @Post('generate-report-id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Generate a unique report ID' })
    @ApiResponse({
        status: 200,
        description: 'Report ID generated',
        schema: {
            type: 'object',
            properties: {
                reportId: { type: 'string' },
            },
        },
    })
    async generateReportId(
        @Body()
        body: {
            deviceId: string;
            timestamp: string;
        },
    ) {
        const reportId = this.oracleService.generateReportId(body.deviceId, body.timestamp);
        return { reportId };
    }

    @Get('info')
    @ApiOperation({ summary: 'Get oracle information' })
    @ApiResponse({
        status: 200,
        description: 'Oracle information',
    })
    getOracleInfo() {
        return this.oracleService.getOracleInfo();
    }

    @Get('health')
    @ApiOperation({ summary: 'Oracle service health check' })
    @ApiResponse({
        status: 200,
        description: 'Service health status',
    })
    healthCheck() {
        return this.oracleService.healthCheck();
    }

    @Get()
    @ApiOperation({ summary: 'Oracle service root endpoint' })
    @ApiResponse({
        status: 200,
        description: 'Service information',
    })
    getRoot() {
        return {
            service: 'Gaia Renewable Energy Oracle',
            version: '1.0.0',
            endpoints: [
                { method: 'POST', path: '/api/oracle/sign', description: 'Sign energy report' },
                { method: 'POST', path: '/api/oracle/verify', description: 'Verify signature' },
                { method: 'POST', path: '/api/oracle/generate-report-id', description: 'Generate report ID' },
                { method: 'GET', path: '/api/oracle/info', description: 'Get oracle info' },
                { method: 'GET', path: '/api/oracle/health', description: 'Health check' },
            ],
        };
    }
}