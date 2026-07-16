[Setup]
AppName=OneView
AppVersion=1.2.7
AppPublisher=WPP
AppPublisherURL=https://wpp.com
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=commandline
DefaultDirName={localappdata}\OneView
DisableDirPage=yes
DisableReadyPage=yes
DisableProgramGroupPage=yes
DisableWelcomePage=no
DisableFinishedPage=yes
CreateUninstallRegKey=yes
Uninstallable=yes
UninstallDisplayName=OneView
UninstallDisplayIcon={app}\oneview.exe
OutputDir=.
OutputBaseFilename=OneViewSetup
SetupIconFile=src\ov-icon.ico
Compression=lzma2
SolidCompression=yes
WizardStyle=modern

; Automatically force close the running application without prompting the user
CloseApplications=no
RestartApplications=no

[Files]
Source: "zig-out\bin\oneview.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "WebView2Loader.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "ui\*"; DestDir: "{app}\ui"; Flags: ignoreversion recursesubdirs createallsubdirs

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
Filename: "taskkill.exe"; Parameters: "/f /im oneview.exe"; Flags: runhidden waituntilterminated

[Code]
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
  if CurPageID = wpWelcome then
  begin
    // Post a BM_CLICK message (245) to click the Next button automatically once the Welcome page is shown
    PostMessage(WizardForm.NextButton.Handle, 245, 0, 0);
  end;
end;
