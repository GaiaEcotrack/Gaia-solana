#!/usr/bin/env node

/**
 * Script de prueba para el servicio de oráculo
 * Este script prueba los endpoints básicos del backend
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';
const ORACLE_URL = `${BASE_URL}/api/oracle`;

// Función para hacer requests HTTP
async function makeRequest(method, url, data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        return {
            status: response.status,
            ok: response.ok,
            data: result,
        };
    } catch (error) {
        return {
            status: 0,
            ok: false,
            error: error.message,
        };
    }
}

// Test 1: Verificar salud del backend
async function testBackendHealth() {
    console.log('🧪 Test 1: Verificando salud del backend...');
    const result = await makeRequest('GET', `${BASE_URL}/health`);

    if (result.ok && result.data.status === 'healthy') {
        console.log('✅ Backend saludable');
        return true;
    } else {
        console.log('❌ Backend no saludable:', result.error || result.data);
        return false;
    }
}

// Test 2: Obtener información del proyecto
async function testProjectInfo() {
    console.log('\n🧪 Test 2: Obteniendo información del proyecto...');
    const result = await makeRequest('GET', `${BASE_URL}/api/info`);

    if (result.ok && result.data.name) {
        console.log('✅ Información del proyecto obtenida:');
        console.log(`   Nombre: ${result.data.name}`);
        console.log(`   Descripción: ${result.data.description}`);
        console.log(`   Equipo: ${result.data.team.join(', ')}`);
        return true;
    } else {
        console.log('❌ Error obteniendo información:', result.error || result.data);
        return false;
    }
}

// Test 3: Obtener información del oráculo
async function testOracleInfo() {
    console.log('\n🧪 Test 3: Obteniendo información del oráculo...');
    const result = await makeRequest('GET', `${ORACLE_URL}/info`);

    if (result.ok && result.data.oraclePublicKey) {
        console.log('✅ Información del oráculo obtenida:');
        console.log(`   Clave pública: ${result.data.oraclePublicKey}`);
        console.log(`   Red: ${result.data.network}`);
        console.log(`   Servicio: ${result.data.service}`);
        return true;
    } else {
        console.log('❌ Error obteniendo información del oráculo:', result.error || result.data);
        return false;
    }
}

// Test 4: Salud del oráculo
async function testOracleHealth() {
    console.log('\n🧪 Test 4: Verificando salud del oráculo...');
    const result = await makeRequest('GET', `${ORACLE_URL}/health`);

    if (result.ok && result.data.status === 'healthy') {
        console.log('✅ Oráculo saludable');
        console.log(`   Uptime: ${result.data.uptime}s`);
        return true;
    } else {
        console.log('❌ Oráculo no saludable:', result.error || result.data);
        return false;
    }
}

// Test 5: Generar ID de reporte
async function testGenerateReportId() {
    console.log('\n🧪 Test 5: Generando ID de reporte...');
    const testData = {
        deviceId: 'test_device_001',
        periodStart: Math.floor(Date.now() / 1000) - 86400, // Hace 24 horas
    };

    const result = await makeRequest('POST', `${ORACLE_URL}/generate-report-id`, testData);

    if (result.ok && result.data.reportId) {
        console.log('✅ ID de reporte generado:');
        console.log(`   Report ID: ${result.data.reportId}`);
        console.log(`   Device ID: ${result.data.deviceId}`);
        return result.data.reportId;
    } else {
        console.log('❌ Error generando ID de reporte:', result.error || result.data);
        return null;
    }
}

// Test 6: Firmar reporte de energía (simulado)
async function testSignEnergyReport() {
    console.log('\n🧪 Test 6: Firmando reporte de energía (simulado)...');

    const reportData = {
        deviceId: 'test_device_001',
        deviceOwner: '4ojkYoX1uzf12i5qiX4gJs4hYkSBp2oAahCV3rrxy4fS', // Address de prueba
        periodStart: Math.floor(Date.now() / 1000) - 86400, // Hace 24 horas
        periodEnd: Math.floor(Date.now() / 1000), // Ahora
        energyWh: 1500000, // 1.5 MWh
        reportId: 'test_report_' + Date.now(),
        additionalData: {
            deviceType: 'solar_panel',
            location: 'Caracas, Venezuela',
            efficiency: 0.85,
        },
    };

    const result = await makeRequest('POST', `${ORACLE_URL}/sign`, reportData);

    if (result.ok && result.data.signature) {
        console.log('✅ Reporte firmado exitosamente:');
        console.log(`   RECs generados: ${result.data.recsGenerated}`);
        console.log(`   Hash del reporte: ${result.data.signature.reportHash.substring(0, 32)}...`);
        console.log(`   Firma: ${result.data.signature.signature.length} bytes`);
        return result.data;
    } else {
        console.log('❌ Error firmando reporte:', result.error || result.data);
        return null;
    }
}

// Función principal de pruebas
async function runAllTests() {
    console.log('🚀 Iniciando pruebas del backend Gaia RECs\n');
    console.log('📊 URL base:', BASE_URL);
    console.log('📊 URL del oráculo:', ORACLE_URL);
    console.log('='.repeat(50));

    const results = {
        backendHealth: await testBackendHealth(),
        projectInfo: await testProjectInfo(),
        oracleInfo: await testOracleInfo(),
        oracleHealth: await testOracleHealth(),
        reportId: await testGenerateReportId(),
        signedReport: await testSignEnergyReport(),
    };

    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN DE PRUEBAS:');
    console.log('='.repeat(50));

    const passed = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;

    console.log(`✅ Pruebas pasadas: ${passed}/${total}`);
    console.log(`📈 Porcentaje: ${Math.round((passed / total) * 100)}%`);

    if (passed === total) {
        console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
        console.log('\n🔧 Próximos pasos:');
        console.log('1. Iniciar el backend: cd backend && npm run dev');
        console.log('2. Ejecutar este script: node test-oracle.js');
        console.log('3. Configurar PostgreSQL con Docker');
        console.log('4. Ejecutar migraciones de Prisma');
    } else {
        console.log('\n⚠️  Algunas pruebas fallaron. Revisa los logs.');
    }

    return passed === total;
}

// Ejecutar pruebas si el script se ejecuta directamente
if (require.main === module) {
    runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ Error ejecutando pruebas:', error);
        process.exit(1);
    });
}

module.exports = {
    runAllTests,
    testBackendHealth,
    testProjectInfo,
    testOracleInfo,
    testOracleHealth,
    testGenerateReportId,
    testSignEnergyReport,
};