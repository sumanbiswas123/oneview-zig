[Setup]
AppName=OneView
AppVersion=1.3.9
AppPublisher=WPP
AppPublisherURL=https://wpp.com
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=commandline
DefaultDirName={localappdata}\OneView
DisableDirPage=yes
DisableReadyPage=yes
DisableProgramGroupPage=yes
DisableWelcomePage=yes
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
CloseApplications=force
RestartApplications=no
CloseApplicationsFilter=*oneview.exe*

[Files]
Source: "zig-out\bin\oneview.exe"; DestDir: "{app}"; Flags: ignoreversion restartreplace
Source: "WebView2Loader.dll"; DestDir: "{app}"; Flags: ignoreversion restartreplace
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
Root: HKCU; Subkey: "Software\OneView\Capabilities\URLAssociations"; ValueType: string; ValueName: "http"; ValueData: "OneViewHTML"
Root: HKCU; Subkey: "Software\OneView\Capabilities\URLAssociations"; ValueType: string; ValueName: "https"; ValueData: "OneViewHTML"
Root: HKCU; Subkey: "Software\OneView\Capabilities\FileAssociations"; ValueType: string; ValueName: ".pdf"; ValueData: "OneViewHTML"
Root: HKCU; Subkey: "Software\OneView\Capabilities\FileAssociations"; ValueType: string; ValueName: ".html"; ValueData: "OneViewHTML"
Root: HKCU; Subkey: "Software\OneView\Capabilities\FileAssociations"; ValueType: string; ValueName: ".htm"; ValueData: "OneViewHTML"

; Classes ProgID registration
Root: HKCU; Subkey: "Software\Classes\OneViewHTML"; ValueType: string; ValueName: ""; ValueData: "OneView Document"
Root: HKCU; Subkey: "Software\Classes\OneViewHTML"; ValueType: string; ValueName: "AppUserModelID"; ValueData: "OneView"
Root: HKCU; Subkey: "Software\Classes\OneViewHTML\Application"; ValueType: string; ValueName: "ApplicationName"; ValueData: "OneView"
Root: HKCU; Subkey: "Software\Classes\OneViewHTML\Application"; ValueType: string; ValueName: "ApplicationIcon"; ValueData: """{app}\oneview.exe"",0"
Root: HKCU; Subkey: "Software\Classes\OneViewHTML\Application"; ValueType: string; ValueName: "ApplicationDescription"; ValueData: "OneView Browser and PDF Viewer"
Root: HKCU; Subkey: "Software\Classes\OneViewHTML\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: """{app}\oneview.exe"",0"
Root: HKCU; Subkey: "Software\Classes\OneViewHTML\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\oneview.exe"" ""%1"""

; Registered Applications mapping
Root: HKCU; Subkey: "Software\RegisteredApplications"; ValueType: string; ValueName: "OneView"; ValueData: "Software\OneView\Capabilities"
Root: HKLM; Subkey: "Software\RegisteredApplications"; ValueType: string; ValueName: "OneView"; ValueData: "Software\OneView\Capabilities"; Flags: noerror uninsdeletevalue
Root: HKLM; Subkey: "Software\OneView\Capabilities"; ValueType: string; ValueName: "ApplicationName"; ValueData: "OneView"; Flags: noerror
Root: HKLM; Subkey: "Software\OneView\Capabilities"; ValueType: string; ValueName: "ApplicationDescription"; ValueData: "OneView Browser and PDF Viewer"; Flags: noerror
Root: HKLM; Subkey: "Software\OneView\Capabilities\URLAssociations"; ValueType: string; ValueName: "http"; ValueData: "OneViewHTML"; Flags: noerror
Root: HKLM; Subkey: "Software\OneView\Capabilities\URLAssociations"; ValueType: string; ValueName: "https"; ValueData: "OneViewHTML"; Flags: noerror
Root: HKLM; Subkey: "Software\OneView\Capabilities\FileAssociations"; ValueType: string; ValueName: ".pdf"; ValueData: "OneViewHTML"; Flags: noerror
Root: HKLM; Subkey: "Software\OneView\Capabilities\FileAssociations"; ValueType: string; ValueName: ".html"; ValueData: "OneViewHTML"; Flags: noerror

[Run]
; Always launch the app when finished
Filename: "{app}\oneview.exe"; Description: "Launch OneView"; Flags: nowait

[UninstallRun]
Filename: "taskkill.exe"; Parameters: "/f /im oneview.exe /t"; Flags: runhidden waituntilterminated

[Code]
procedure KillRunningApp();
var
  ResultCode: Integer;
begin
  Exec('taskkill.exe', '/f /im oneview.exe /t', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
  Sleep(500);
end;

function InitializeSetup(): Boolean;
begin
  Result := True;
  KillRunningApp();
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssInstall then
  begin
    KillRunningApp();
  end;
end;

procedure CurPageChanged(CurPageID: Integer);
begin
  if CurPageID = wpWelcome then
  begin
    // Post a BM_CLICK message (245) to click the Next button automatically once the Welcome page is shown
    PostMessage(WizardForm.NextButton.Handle, 245, 0, 0);
  end;
end;
