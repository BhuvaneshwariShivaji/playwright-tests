Param(
    [string]$resultsDir = "allure-results",
    [string]$reportDir = "allure-report"
)

if (Test-Path "$reportDir\history") {
    Write-Host "Preserving history from $reportDir\history to $resultsDir\history"
    if (-not (Test-Path $resultsDir)) {
        New-Item -ItemType Directory -Path $resultsDir | Out-Null
    }
    Remove-Item -Recurse -Force "$resultsDir\history" -ErrorAction SilentlyContinue
    Copy-Item -Recurse -Force "$reportDir\history" "$resultsDir\history"
} else {
    Write-Host "No existing history folder found in $reportDir. Starting fresh."
}

npx allure generate $resultsDir --clean -o $reportDir

Write-Host "Allure report generated at $reportDir"
Write-Host "Open it with: npx allure open $reportDir"
