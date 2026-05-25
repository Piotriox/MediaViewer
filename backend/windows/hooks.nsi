!macro NSIS_HOOK_POSTINSTALL
  ; Tauri NSIS template already includes `FileAssociation.nsh`.
  ; Register common image/video extensions to open with this app.

  ; NOTE: Windows may still require a user "Always open with" confirmation
  ; for some extensions due to UserChoice protections.

  ${RegisterExtension} "$INSTDIR\${MAINBINARYNAME}.exe" ".jpg"  "MediaViewer Image"
  ${RegisterExtension} "$INSTDIR\${MAINBINARYNAME}.exe" ".jpeg" "MediaViewer Image"
  ${RegisterExtension} "$INSTDIR\${MAINBINARYNAME}.exe" ".png"  "MediaViewer Image"
  ${RegisterExtension} "$INSTDIR\${MAINBINARYNAME}.exe" ".gif"  "MediaViewer Image"
  ${RegisterExtension} "$INSTDIR\${MAINBINARYNAME}.exe" ".bmp"  "MediaViewer Image"
  ${RegisterExtension} "$INSTDIR\${MAINBINARYNAME}.exe" ".webp" "MediaViewer Image"

  ${RegisterExtension} "$INSTDIR\${MAINBINARYNAME}.exe" ".svg"  "MediaViewer Image"

  ${RegisterExtension} "$INSTDIR\${MAINBINARYNAME}.exe" ".mp4"  "MediaViewer Video"
  ${RegisterExtension} "$INSTDIR\${MAINBINARYNAME}.exe" ".webm" "MediaViewer Video"
  ${RegisterExtension} "$INSTDIR\${MAINBINARYNAME}.exe" ".ogg"  "MediaViewer Video"
  ${RegisterExtension} "$INSTDIR\${MAINBINARYNAME}.exe" ".mov"  "MediaViewer Video"
  ${RegisterExtension} "$INSTDIR\${MAINBINARYNAME}.exe" ".mkv"  "MediaViewer Video"
  ${RegisterExtension} "$INSTDIR\${MAINBINARYNAME}.exe" ".avi"  "MediaViewer Video"
  ${RegisterExtension} "$INSTDIR\${MAINBINARYNAME}.exe" ".wmv"  "MediaViewer Video"
  ${RegisterExtension} "$INSTDIR\${MAINBINARYNAME}.exe" ".m4v"  "MediaViewer Video"
!macroend

!macro NSIS_HOOK_POSTUNINSTALL
  ; Remove associations on uninstall.

  ${UnRegisterExtension} ".jpg"  "MediaViewer Image"
  ${UnRegisterExtension} ".jpeg" "MediaViewer Image"
  ${UnRegisterExtension} ".png"  "MediaViewer Image"
  ${UnRegisterExtension} ".gif"  "MediaViewer Image"
  ${UnRegisterExtension} ".bmp"  "MediaViewer Image"
  ${UnRegisterExtension} ".webp" "MediaViewer Image"
  ${UnRegisterExtension} ".svg"  "MediaViewer Image"

  ${UnRegisterExtension} ".mp4"  "MediaViewer Video"
  ${UnRegisterExtension} ".webm" "MediaViewer Video"
  ${UnRegisterExtension} ".ogg"  "MediaViewer Video"
  ${UnRegisterExtension} ".mov"  "MediaViewer Video"
  ${UnRegisterExtension} ".mkv"  "MediaViewer Video"
  ${UnRegisterExtension} ".avi"  "MediaViewer Video"
  ${UnRegisterExtension} ".wmv"  "MediaViewer Video"
  ${UnRegisterExtension} ".m4v"  "MediaViewer Video"
!macroend

