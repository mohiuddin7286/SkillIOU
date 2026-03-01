param(
    [string]$JavaHome = "C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot"
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

function Test-ValidJavaHome {
    param([string]$PathValue)

    if (-not $PathValue) {
        return $false
    }

    if ($PathValue -match '[\*\?\[]') {
        return $false
    }

    $javaExePath = Join-Path $PathValue "bin\java.exe"
    return (Test-Path -LiteralPath $javaExePath)
}

if (-not (Test-Path ".\mvnw.cmd")) {
    throw "mvnw.cmd not found in $projectRoot"
}

$resolvedJavaHome = $env:JAVA_HOME
if (-not (Test-ValidJavaHome -PathValue $resolvedJavaHome)) {
    if (Test-ValidJavaHome -PathValue $JavaHome) {
        $resolvedJavaHome = $JavaHome
    }
    else {
        $javaCommand = Get-Command java -ErrorAction SilentlyContinue
        if ($javaCommand -and $javaCommand.Source) {
            $resolvedJavaHome = Split-Path -Parent (Split-Path -Parent $javaCommand.Source)
        }
    }
}

if (-not (Test-ValidJavaHome -PathValue $resolvedJavaHome)) {
    throw "No valid JDK found. Install JDK 21+ and set JAVA_HOME."
}

$env:JAVA_HOME = $resolvedJavaHome
$javaBinPath = Join-Path $env:JAVA_HOME "bin"
if (-not (($env:Path -split ";") -contains $javaBinPath)) {
    $env:Path = "$javaBinPath;$env:Path"
}

Write-Host "Using JAVA_HOME=$env:JAVA_HOME"
& ".\mvnw.cmd" "spring-boot:run"
