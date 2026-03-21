<#
  create_files_from_patch.ps1
  Reads a custom patch file (solarhome-mvp.diff) using the
  '*** Add File: <path>' / '+' lines format and writes the files.
  Usage:
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    .\create_files_from_patch.ps1 -DiffFile solarhome-mvp.diff
#>

param(
  [Parameter(Mandatory=$true)]
  [string]$DiffFile
)

if (-not (Test-Path $DiffFile)) {
  Write-Error "Diff file not found: $DiffFile"
  exit 1
}

$lines = Get-Content -Raw -Path $DiffFile -Encoding UTF8 -ErrorAction Stop
# Normalize line endings
$lines = $lines -replace "`r`n", "`n"
$linesArray = $lines -split "`n"

$currentPath = $null
$currentContent = New-Object System.Collections.Generic.List[string]

function Flush-Current {
  param($path, $contentList)
  if (-not $path) { return }
  $dir = Split-Path -Path $path -Parent
  if ($dir -and -not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }
  # Remove leading '+' from lines if present
  $outLines = @()
  foreach ($l in $contentList) {
    if ($l -like '+*') {
      $outLines += $l.Substring(1)
    } else {
      # keep lines that are not prefixed (defensive)
      $outLines += $l
    }
  }
  # Write file as UTF8 without BOM
  $outLines | Out-File -FilePath $path -Encoding utf8 -Force
  Write-Host "Wrote file:" $path
}

for ($i = 0; $i -lt $linesArray.Length; $i++) {
  $line = $linesArray[$i]

  if ($line -match '^\*\*\* Add File:\s*(.+)$') {
    # flush previous
    if ($currentPath) {
      Flush-Current -path $currentPath -contentList $currentContent
    }
    $currentPath = $Matches[1].Trim()
    $currentContent = New-Object System.Collections.Generic.List[string]
    # skip to next line
    continue
  }

  if ($line -match '^\*\*\* End Patch') {
    # flush and stop if this is the final end marker for a file block
    if ($currentPath) {
      Flush-Current -path $currentPath -contentList $currentContent
      $currentPath = $null
      $currentContent = New-Object System.Collections.Generic.List[string]
    }
    continue
  }

  if ($currentPath) {
    # Collect lines that start with '+' or blank lines (we keep them)
    # Keep the original line as-is (we will strip leading '+' when writing)
    $currentContent.Add($line)
  }
}

# flush any remaining
if ($currentPath) {
  Flush-Current -path $currentPath -contentList $currentContent
}

Write-Host "Done. Created files from $DiffFile"