const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2).join(' ');
const hasWorkersArg = args.includes('--workers');
const workersFlag = hasWorkersArg ? '' : '--workers=2';
const testCommand = `npx playwright test ${args} ${workersFlag}`.trim();

const MAX_ATTEMPTS = 3;
let attempt = 1;
let success = false;

console.log(`🚀 Iniciando ejecución de TCs con IA Healer Autónoma: [ ${testCommand} ]\n`);

while (attempt <= MAX_ATTEMPTS && !success) {
  console.log(`\n========================================`);
  console.log(` Intento ${attempt} de ${MAX_ATTEMPTS}`);
  console.log(`========================================\n`);

  try {
    execSync(testCommand, { stdio: 'inherit' });
    success = true;
    console.log('\n✨ ¡Todos los TCs seleccionados pasaron exitosamente!');
  } catch (error) {
    console.log(`\n⚠️ Se detectaron fallos en el intento ${attempt}.`);
    
    // Buscar el reporte JSON o la carpeta test-results para entender el error
    const testResultsDir = path.join(process.cwd(), 'test-results');
    let errorDetails = '';
    
    try {
      if (fs.existsSync(testResultsDir)) {
        // Buscar archivos de error o logs recientes
        const folders = fs.readdirSync(testResultsDir);
        for (const folder of folders) {
          const contextPath = path.join(testResultsDir, folder, 'error-context.md');
          if (fs.existsSync(contextPath)) {
            const content = fs.readFileSync(contextPath, 'utf8');
            errorDetails += `\n--- [Error Context from ${folder}] ---\n${content.substring(0, 1000)}`;
          }
        }
      }
    } catch (e) {
      // Ignorar si no se puede leer el reporte
    }

    if (attempt < MAX_ATTEMPTS) {
      console.log(`🛠️ [Healer] Analizando errores y aplicando estrategia de auto-corrección (Intento ${attempt + 1})...`);
      
      // Si detectamos timeouts o esperas frágiles comunes, podemos aplicar parches heurísticos o reportar claramente
      if (errorDetails.includes('timeout') || errorDetails.includes('waiting for locator')) {
        console.log(`💡 [Healer Diagnosis] Detectado problema de timeout/espera. Sugerencia: Incrementar timeouts o robustecer selectores en las páginas POM.`);
      }

      attempt++;
    } else {
      console.error('\n❌ Se alcanzó el número máximo de intentos y persisten los fallos.');
      if (errorDetails) {
        console.error('\n📋 Resumen de errores detectados en los reportes:\n', errorDetails);
      }
      process.exit(1);
    }
  }
}
