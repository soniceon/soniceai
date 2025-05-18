# Function to kill process on a specific port
function Kill-ProcessOnPort {
    param (
        [int]$port
    )
    
    $processId = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    
    if ($processId) {
        Write-Host "Found process using port $port with PID: $processId"
        Stop-Process -Id $processId -Force
        Write-Host "Process killed successfully"
    } else {
        Write-Host "No process found using port $port"
    }
}

# Function to start the service
function Start-MyService {
    param (
        [string]$command
    )
    
    Write-Host "Starting service..."
    Invoke-Expression $command
}

# Main execution
$port = 3000  # Change this to your desired port
$startCommand = "npm start"  # Change this to your service start command

# Kill any process using the specified port
Kill-ProcessOnPort -port $port

# Start the service
Start-MyService -command $startCommand 