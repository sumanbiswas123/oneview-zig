[Setup]
AppName=OneView
AppVersion=1.2.7
AppPublisher=WPP
AppPublisherURL=https://wpp.com
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=commandline
DefaultDirName={localappdata}\OneView
DisableDirPage=yes
DisableProgramGroupPage=yes
DisableWelcomePage=yes
DisableReadyPage=no
DisableFinishedPage=yes
CreateUninstallRegKey=yes
Uninstallable=yes
UninstallDisplayName=OneView
UninstallDisplayIcon={app}\oneview.exe
OutputDir=.
OutputBaseFilename=setup
SetupIconFile=src\ov-icon.ico
Compression=lzma2
SolidCompression=yes
WizardStyle=modern

; Automatically force close the running application without prompting the user
CloseApplications=yes
CloseApplicationsFilter=oneview.exe
RestartApplications=no

[Files]
Source: "zig-out\bin\oneview.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "WebView2Loader.dll"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{userdesktop}\OneView"; Filename: "{app}\oneview.exe"; IconFilename: "{app}\oneview.exe"
Name: "{userprograms}\OneView"; Filename: "{app}\oneview.exe"; IconFilename: "{app}\oneview.exe"

[Registry]
; Installed size for Settings page (in KB)
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Uninstall\OneView_is1"; ValueType: dword; ValueName: "EstimatedSize"; ValueData: "3868"
; Startup run
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; ValueName: "OneView"; ValueData: "{app}\oneview.exe"
; Capability registration
Root: HKCU; Subkey: "Software\OneView\Capabilities"; ValueType: string; ValueName: "ApplicationName"; ValueData: "OneView"
Root: HKCU; Subkey: "Software\OneView\Capabilities"; ValueType: string; ValueName: "ApplicationDescription"; ValueData: "OneView Browser and PDF Viewer"
Root: HKCU; Subkey: "Software\OneView\Capabilities\URLAssociations"; ValueType: string; ValueName: "http"; ValueData: "OneView.Assoc"
Root: HKCU; Subkey: "Software\OneView\Capabilities\URLAssociations"; ValueType: string; ValueName: "https"; ValueData: "OneView.Assoc"
Root: HKCU; Subkey: "Software\OneView\Capabilities\FileAssociations"; ValueType: string; ValueName: ".pdf"; ValueData: "OneView.Assoc"
Root: HKCU; Subkey: "Software\OneView\Capabilities\FileAssociations"; ValueType: string; ValueName: ".html"; ValueData: "OneView.Assoc"
Root: HKCU; Subkey: "Software\Classes\OneView.Assoc"; ValueType: string; ValueName: ""; ValueData: "OneView Document"
Root: HKCU; Subkey: "Software\Classes\OneView.Assoc\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\oneview.exe"" ""%1"""
Root: HKCU; Subkey: "Software\RegisteredApplications"; ValueType: string; ValueName: "OneView"; ValueData: "Software\OneView\Capabilities"

[Run]
; Always launch the app when finished
Filename: "{app}\oneview.exe"; Description: "Launch OneView"; Flags: nowait

[UninstallRun]
Filename: "powershell.exe"; Parameters: "-NoProfile -NonInteractive -WindowStyle Hidden -Command ""Stop-Process -Name oneview -Force -ErrorAction SilentlyContinue"""; Flags: runhidden waituntilterminated

[Code]
var
  AutoClickTimer: LongWord;

function SetTimer(hWnd: HWND; nIDEvent, uElapse: LongWord; lpTimerFunc: LongWord): LongWord;
  external 'SetTimer@user32.dll stdcall';
function KillTimer(hWnd: HWND; uIDEvent: LongWord): LongBool;
  external 'KillTimer@user32.dll stdcall';

procedure OnAutoClickTimer(H: HWND; Msg: LongWord; EventVal: LongWord; TimeVal: LongWord);
begin
  // Kill the timer so it only fires once
  KillTimer(WizardForm.Handle, AutoClickTimer);
  AutoClickTimer := 0;
  
  // Programmatically click "Install" on the Ready page
  WizardForm.NextButton.OnClick(WizardForm.NextButton);
end;

function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
begin
  Result := True;
  
  // Force close any running oneview.exe process immediately before starting setup
  Exec('taskkill.exe', '/f /im oneview.exe', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
end;

procedure CurPageChanged(CurPageID: Integer);
begin
  // If the Ready to Install page shows, set a 50ms timer to trigger the click
  if CurPageID = wpReady then
  begin
    AutoClickTimer := SetTimer(WizardForm.Handle, 2, 50, CreateCallback(@OnAutoClickTimer));
  end;
end;

procedure DeinitializeSetup();
begin
  if AutoClickTimer <> 0 then
    KillTimer(WizardForm.Handle, AutoClickTimer);
end;
