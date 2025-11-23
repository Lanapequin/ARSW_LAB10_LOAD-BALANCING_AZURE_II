### Escuela Colombiana de Ingeniería

### Arquitecturas de Software - ARSW

## Escalamiento en Azure con Maquinas Virtuales, Sacale Sets y Service Plans

### Integrantes

- Laura Natalia Perilla Quintero - [Lanapequin](https://github.com/Lanapequin)
- Santiago Botero Garcia - [LePeanutButter](https://github.com/LePeanutButter)

### Dependencias

- Cree una cuenta gratuita dentro de Azure. Para hacerlo puede guiarse de esta [documentación](https://azure.microsoft.com/es-es/free/students/). Al hacerlo usted contará con $100 USD para gastar durante 12 meses.
  Antes de iniciar con el laboratorio, revise la siguiente documentación sobre las [Azure Functions](https://www.c-sharpcorner.com/article/an-overview-of-azure-functions/)

### Parte 0 - Entendiendo el escenario de calidad

Adjunto a este laboratorio usted podrá encontrar una aplicación totalmente desarrollada que tiene como objetivo calcular el enésimo valor de la secuencia de Fibonnaci.

**Escalabilidad**
Cuando un conjunto de usuarios consulta un enésimo número (superior a 1000000) de la secuencia de Fibonacci de forma concurrente y el sistema se encuentra bajo condiciones normales de operación, todas las peticiones deben ser respondidas y el consumo de CPU del sistema no puede superar el 70%.

### Escalabilidad Serverless (Functions)

1. Cree una Function App tal cual como se muestra en las imagenes.

![](images/part3/part3-function-config.png)

![](images/part3/part3-function-configii.png)

2. Instale la extensión de **Azure Functions** para Visual Studio Code.

![](images/part3/part3-install-extension.png)

3. Despliegue la Function de Fibonacci a Azure usando Visual Studio Code. La primera vez que lo haga se le va a pedir autenticarse, siga las instrucciones.

![](images/part3/part3-deploy-function-1.png)

![](images/part3/part3-deploy-function-2.png)

4. Dirijase al portal de Azure y pruebe la function.

![](images/part3/part3-test-function.png)

5. Modifique la coleción de POSTMAN con NEWMAN de tal forma que pueda enviar 10 peticiones concurrentes. Verifique los resultados y presente un informe.

6. Cree una nueva Function que resuleva el problema de Fibonacci pero esta vez utilice un enfoque recursivo con memoization. Pruebe la función varias veces, después no haga nada por al menos 5 minutos. Pruebe la función de nuevo con los valores anteriores. ¿Cuál es el comportamiento?.

### Desarrollo Escalabilidad Serverless (Functions)

1. **Creación del Function App**

   - **Subscription**: Azure for Students
   - **Resource Group**: SCALABILITY_LAB_II
   - **Function App name**: FunctionProjectFibonaccii
   - **Runtime stack**: Node.js
   - **Version**: 22 LTS
   - **Region**: East US 2

   ![Picture2.png](images/lab10/Picture2.png)

2. **Instalación de Azure Functions Extension**
   
   Para facilitar el desarrollo y despliegue, instalamos la extensión oficial de Azure Functions en Visual Studio Code.

   ![Picture3.png](images/lab10/Picture3.png)

   Ademas, se ejecuto 
      ```bash
      npm i -g azure-functions-core-tools@4
      ```
   Con el fin de instalar de forma global las Azure Functions Core Tools en su versión 4, que son las herramientas necesarias para crear, ejecutar, probar y publicar funciones de Azure desde el computador.
   
3. **Despliegue de la Function de Fibonacci a Azure**

   Una vez configurado el entorno de desarrollo, procedimos a desplegar la función de Fibonacci a Azure directamente desde Visual Studio Code.

   ![Picture5.png](images/lab10/Picture5.png)

   ![Picture6.png](images/lab10/Picture6.png)

4. **Prueba desde el Portal de Azure**

   Después del despliegue exitoso, verificamos el funcionamiento de la función directamente desde el portal de Azure.

   ```json
   {
       "nth": 1000000
   }
   ```
   
   ![Picture7.png](images/lab10/Picture7.png)
   
5. **Pruebas de Concurrencia con Newman**

   Realizamos pruebas de carga ejecutando 10 peticiones concurrentes a la función de Fibonacci para evaluar el comportamiento del sistema bajo estrés.

   Ejecutamos 10 instancias de Newman en paralelo usando el operador `&` en Command Prompt, cada una generando su propio reporte HTML:

   ```bash
   newman run ARSW-LAB10.postman_collection.json --reporters cli,htmlextra --reporter-htmlextra-export reports/report-1.html &
   newman run ARSW-LAB10.postman_collection.json --reporters cli,htmlextra --reporter-htmlextra-export reports/report-2.html &
   newman run ARSW-LAB10.postman_collection.json --reporters cli,htmlextra --reporter-htmlextra-export reports/report-3.html &
   newman run ARSW-LAB10.postman_collection.json --reporters cli,htmlextra --reporter-htmlextra-export reports/report-4.html &
   newman run ARSW-LAB10.postman_collection.json --reporters cli,htmlextra --reporter-htmlextra-export reports/report-5.html &
   newman run ARSW-LAB10.postman_collection.json --reporters cli,htmlextra --reporter-htmlextra-export reports/report-6.html &
   newman run ARSW-LAB10.postman_collection.json --reporters cli,htmlextra --reporter-htmlextra-export reports/report-7.html &
   newman run ARSW-LAB10.postman_collection.json --reporters cli,htmlextra --reporter-htmlextra-export reports/report-8.html &
   newman run ARSW-LAB10.postman_collection.json --reporters cli,htmlextra --reporter-htmlextra-export reports/report-9.html &
   newman run ARSW-LAB10.postman_collection.json --reporters cli,htmlextra --reporter-htmlextra-export reports/report-10.html
   ```
   
   ![Picture11.png](images/lab10/Picture11.png)

   ![Picture12.png](images/lab10/Picture12.png)

   Análisis:

   - La mayoría de las peticiones fueron exitosas, lo que indica que el servicio soporta la carga concurrente.
   - El tiempo de respuesta promedio se mantuvo estable en la mayoría de los casos, salvo una ejecución con 3.3 s, posiblemente por latencia en el servidor.

6. **Function con Memoization**

   Creamos una segunda función que implementa el cálculo de Fibonacci con memoization para optimizar el rendimiento.
   
   ![Picture10.png](images/lab10/Picture10.png)

   ![Picture13.png](images/lab10/Picture13.png)
   
   Codigo ejecutado:

   ```bash
   newman run ARSW-LAB10.postman_collection_memoization.json --reporters cli,htmlextra --reporter-htmlextra-export reports-memoization/report-1.html &
   newman run ARSW-LAB10.postman_collection_memoization.json --reporters cli,htmlextra --reporter-htmlextra-export reports-memoization/report-2.html &
   newman run ARSW-LAB10.postman_collection_memoization.json --reporters cli,htmlextra --reporter-htmlextra-export reports-memoization/report-3.html &
   newman run ARSW-LAB10.postman_collection_memoization.json --reporters cli,htmlextra --reporter-htmlextra-export reports-memoization/report-4.html &
   newman run ARSW-LAB10.postman_collection_memoization.json --reporters cli,htmlextra --reporter-htmlextra-export reports-memoization/report-5.html &
   newman run ARSW-LAB10.postman_collection_memoization.json --reporters cli,htmlextra --reporter-htmlextra-export reports-memoization/report-6.html &
   newman run ARSW-LAB10.postman_collection_memoization.json --reporters cli,htmlextra --reporter-htmlextra-export reports-memoization/report-7.html &
   newman run ARSW-LAB10.postman_collection_memoization.json --reporters cli,htmlextra --reporter-htmlextra-export reports-memoization/report-8.html &
   newman run ARSW-LAB10.postman_collection_memoization.json --reporters cli,htmlextra --reporter-htmlextra-export reports-memoization/report-9.html &
   newman run ARSW-LAB10.postman_collection_memoization.json --reporters cli,htmlextra --reporter-htmlextra-export reports-memoization/report-10.html
   ```
   
   Antes de los 5 minutos:

   ![Picture14.png](images/lab10/Picture14.png)

   Despues de los 5 minutos:

   ![Picture15.png](images/lab10/Picture15.png)

   El comportamiento observado se debe a que la función recursiva con memoization almacena los resultados calculados en memoria, evitando recalcular valores ya obtenidos. En la primera ejecución, el tiempo fue mayor porque se construyó el caché; después de esperar 5 minutos, el caché permaneció activo, por lo que la segunda ejecución fue más rápida al reutilizar los resultados almacenados. Esto explica la reducción en el tiempo promedio de respuesta entre las dos pruebas.

**Preguntas**

1. ¿Qué es un Azure Function?
2. ¿Qué es serverless?
3. ¿Qué es el runtime y que implica seleccionarlo al momento de crear el Function App?
4. ¿Por qué es necesario crear un Storage Account de la mano de un Function App?
5. ¿Cuáles son los tipos de planes para un Function App?, ¿En qué se diferencias?, mencione ventajas y desventajas de cada uno de ellos.
6. ¿Por qué la memoization falla o no funciona de forma correcta?
7. ¿Cómo funciona el sistema de facturación de las Function App?
8. Informe

**Respuestas**

1. Azure Functions es un servicio de compute serverless de Azure que permite ejecutar código basado en eventos. Son bloques de código que se invocan por distintos triggers y pueden tener bindings para conectarse a otros servicios sin escribir todo el código de integración. Se abstrae de la infraestructura, y se concentra en la lógica de la función, y Azure administra el aprovisionamiento de recursos. [(Ggailey, n.d.)](#function)

2. Serverless es un modelo de ejecución en la nube en el que el proveedor abstrae el servidor físico o virtual. Las principales ventajas son pagar solo por el recurso realmente usado, escalado automático según demanda, y mayor velocidad de desarrollo porque ce concentra en el código. [(Sin Servidor En Azure | Microsoft Azure, n.d.)](#serverless)

3. El runtime es el entorno que ejecuta las funciones, incluye la versión del host de Azure Functions, el lenguaje y el modelo de ejecución. Al seleccionarlo se define cómo será interpretado o compilado el código, cuáles librerías se pueden usar, y qué versión de runtime se usara. Además, elegir un runtime compatible es importante para compatibilidad, desempeño, latencia y soporte de características como Durable Functions. [(Ggailey, n.d.)](#function)

4. Cada Function App requiere una cuenta de almacenamiento de Azure porque el runtime la usa para varios propósitos como mantener las keys de funciones, guardar la configuración, llevar el estado, persistir el código en ciertos planes, etc. [(Ggailey, n.d.-b)](#storage)

5. Según la documentación oficial de Microsoft, los principales planes de alojamiento son: Consumption, Flex Consumption, Premium y Dedicated. [(Ggailey, n.d.-b)](#hosting)

   | Plan                 | Escalado / Comportamiento                                                                            | Ventajas                                                                                                            | Desventajas                                                                                                  |
   | -------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
   | **Consumption**      | Escala automáticamente según los eventos y puede reducirse a cero instancias cuando no existe carga. | Se paga únicamente por el uso (ejecuciones, tiempo y memoria). Resulta muy económico para cargas variables.         | Presenta cold starts, tiene un límite máximo de ejecución y ofrece menor control sobre los recursos.         |
   | **Flex Consumption** | Ofrece un escalado más rápido; permite configurar instancias always ready y definir concurrencia.    | Disminuye los cold starts, es adecuado para redes privadas (VNet) y brinda mayor control de rendimiento y memoria.  | Puede generar mayores costos si se mantienen varias instancias always ready; su facturación es más compleja. |
   | **Premium**          | Escala automáticamente manteniendo instancias precalentadas para asegurar baja latencia.             | Elimina los cold starts, soporta VNet, permite tiempos de ejecución prolongados y garantiza rendimiento estable.    | Implica un costo mínimo constante por las instancias precalentadas; resulta más costoso para cargas bajas.   |
   | **Dedicated**        | Utiliza máquinas dedicadas definidas por el usuario.                                                 | Puede ser rentable si ya se dispone de un App Service Plan; ofrece control total y es ideal para cargas constantes. | No escala con rapidez, requiere habilitar Always On y es ineficiente para cargas muy variables.              |

6. En un contexto de Azure Functions, varias razones pueden hacer que la memoización no se note o falle:

   - Si la función se utiliza de forma stateless, cada ejecución puede iniciarse en una instancia diferente sin historial del valor anterior, por lo que la tabla de memoización podría no persistir entre invocaciones.
   - Si la función muere, la instancia se recicla o escala a cero, el estado mantenido en memoria local se pierde.
   - Si no se emplea almacenamiento persistente para guardar los resultados de la memoización (por ejemplo, Azure Cache, Redis o algún almacenamiento compartido entre instancias) y se usan solo variables locales, dichos valores no se conservan entre ejecuciones.

   Por lo tanto, la memoización in-memory no es confiable en funciones serverless sin algún mecanismo de almacenamiento externo persistente.

7. Dependiendo del plan, el modelo de facturación varía:

   - En el plan Consumption, la facturación se basa en el número de ejecuciones, el tiempo de ejecución y la memoria utilizada. [(Ggailey, n.d.-a)](#consumption)
   - En Flex Consumption, existen dos modos: On Demand donde se paga únicamente cuando las instancias están ejecutándose y Always Ready, que permite configurar instancias siempre preparadas y pagar por la memoria asignada incluso cuando están inactivas. [(Ggailey, n.d.-a)](#consumption)
   - En el plan Premium, la facturación se determina por core-seconds y por la memoria asignada a las instancias, y no por ejecución. Además, siempre existe al menos una instancia activa, lo que implica un costo fijo. [(Ggailey, n.d.-a)](#consumption)
   - En el plan Dedicated, el pago funciona igual que en cualquier App Service Plan: se factura la infraestructura (instancias) y no las ejecuciones individuales. [(Ggailey, n.d.-a)](#consumption)

   Adicionalmente, debe considerarse que la cuenta de almacenamiento es un recurso independiente que se factura por separado. En muchos planes, el almacenamiento utilizado por la Function App no está cubierto por cuotas gratuitas.

8. **Informe**

   ##### Resultados Obtenidos

   ##### Escenario 1: Sin Memoización

   - Duración total: 3.3 segundos

   Análisis: En este escenario, cada petición calculó la serie de Fibonacci de manera independiente desde cero, lo que resultó en un incremento significativo del tiempo de procesamiento debido a la ausencia de reutilización de cálculos previos.

   ##### Escenario 2: Con Memoización

   - Duración total: 676 milisegundos

   Análisis: La implementación de memoización permitió reutilizar los resultados previamente calculados y almacenados en caché, reduciendo drásticamente el tiempo de respuesta incluso bajo múltiples peticiones concurrentes.

   ##### Comparativa de Rendimiento

   | Métrica | Sin Memoización | Con Memoización |
   |---------|-----------------|-----------------|
   | Duración total | 3.3 s | 676 ms |

   Los resultados demuestran que la memoización mejora significativamente el rendimiento del sistema bajo carga concurrente. Al evitar cálculos repetitivos y aprovechar la caché en memoria, se logró reducir el tiempo de respuesta de **3.2 segundos a 660 milisegundos**.
   Esta optimización resulta especialmente valiosa en escenarios de alta concurrencia, donde múltiples usuarios realizan peticiones simultáneas que requieren cálculos complejos.
   

**Bibliografias**

- <a id="function"></a> [1] Ggailey. (n.d.). Azure Functions overview. Microsoft Learn. https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview
- <a id="serverless"></a> [2] Sin servidor en Azure | Microsoft Azure. (n.d.). https://azure.microsoft.com/es-es/solutions/serverless
- <a id="storage"></a> [3] Ggailey. (n.d.-b). Storage considerations for Azure Functions. Microsoft Learn. https://learn.microsoft.com/en-sg/azure/azure-functions/storage-considerations
- <a id="hosting"></a> [4] Ggailey. (n.d.-b). Azure Functions scale and hosting. Microsoft Learn. https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale
- <a id="consumption"></a> [5] Ggailey. (n.d.-a). Azure Functions Consumption plan hosting. Microsoft Learn. https://learn.microsoft.com/en-us/azure/azure-functions/consumption-plan
