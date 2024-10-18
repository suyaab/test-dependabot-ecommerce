# DTC Function Application

This application consists of all of DTC's serverless functions that support the product's asynchronous operations.

The areas of the product that are primarily handled here are:

1. Post Order Processing (`/src/orders`)
2. Fulfillment Service (`/src/fulfillment-service`)
3. Subscription Manager (`/src/subscription-manager`)
4. Emails (`/src/notifications`)

## Azure V4 Functions

This application
implements [Azure Version 4 Typescript](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference?tabs=blob&pivots=programming-language-typescript),
and mostly
uses [HTTP triggers](https://learn.microsoft.com/en-us/azure/azure-functions/functions-create-function-app-portal?pivots=programming-language-typescript), [Timer triggers](https://learn.microsoft.com/en-us/azure/azure-functions/functions-create-scheduled-function),
or [Service Bus/Queue Message triggers](https://learn.microsoft.com/en-us/azure/azure-functions/functions-create-storage-queue-triggered-function).

## Local Setup

### Install

Install the `Azure Function Core Tools`,
the [current recommended way](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local)
uses `homebrew`:

```bash
brew tap azure/functions
brew install azure-functions-core-tools@4
```

### Start

[Guide](https://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-local)

1. Ensure you have `local.settings.json` at `apps/functions/` root.

    ```json
    {
      "IsEncrypted": false,
      "Values": {
        "FUNCTIONS_WORKER_RUNTIME": "node",
        "AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
        "AzureWebJobsStorage": "UseDevelopmentStorage=true",
        "SUBSCRIPTION_MANAGER_SCHEDULE": "0 */5 * * * *",
        "AZURE_SERVICEBUS_CONN_STR": "<not required it will show errors but still testable>",
        "...OTHER ENVIRONMENT VARIABLES": "VALUES HERE"
      },
      "Host": {
        "LocalHttpPort": 7071,
        "CORS": "*",
        "CORSCredentials": false
      }
    }
    ```

2. Navigate to one of the functions located at `apps/functions` and run:

    ```bash
    func start
    ```

This will start all function apps on `http://localhost:7071`

Example:

```bash
func start --functions dtc-order-subscription-manager-process-order
```

### Manually Executing Non-HTTP Functions
https://learn.microsoft.com/en-us/azure/azure-functions/functions-manually-run-non-http?tabs=azure-portal