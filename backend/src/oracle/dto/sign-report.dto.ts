import { IsString, IsNumber, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignReportDto {
    @ApiProperty({
        description: 'Device ID that generated the energy report',
        example: 'device_1234567890',
    })
    @IsString()
    @IsNotEmpty()
    deviceId: string;

    @ApiProperty({
        description: 'Energy generated in kilowatt-hours (kWh)',
        example: 150.5,
    })
    @IsNumber()
    @IsNotEmpty()
    energyGenerated: number;

    @ApiProperty({
        description: 'Timestamp when energy was generated (ISO string)',
        example: '2026-03-11T10:30:00Z',
    })
    @IsDateString()
    @IsNotEmpty()
    timestamp: string;

    @ApiProperty({
        description: 'Geographic location of the device',
        example: 'Bogotá, Colombia',
        required: false,
    })
    @IsString()
    @IsOptional()
    location?: string;

    @ApiProperty({
        description: 'Type of renewable energy source',
        example: 'solar',
        required: false,
    })
    @IsString()
    @IsOptional()
    energyType?: string;
}

export class SignedReportResponseDto {
    @ApiProperty({
        description: 'Unique report ID',
        example: 'report_abc123def456',
    })
    reportId: string;

    @ApiProperty({
        description: 'Digital signature of the oracle',
        example: '0x1234567890abcdef...',
    })
    signature: string;

    @ApiProperty({
        description: 'Public key of the oracle',
        example: 'oracle_public_key_here',
    })
    oraclePublicKey: string;

    @ApiProperty({
        description: 'Timestamp when the report was signed',
        example: '2026-03-11T10:35:00Z',
    })
    signedAt: string;

    @ApiProperty({
        description: 'Original report data',
    })
    reportData: SignReportDto;
}