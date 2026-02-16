Step B: Styling (Copy-Paste)
Open your existing repo (with the styles) and your new project in separate Cursor 
windows. 
Index the source. In the source repo window, let Cursor index the files (Ctrl/Cmd + L 
to open chat).
Prompt for Porting. Ask Gemini: "I have this SvelteKit/Tailwind layout in [File Name]. 
Rewrite this as a reusable component for my new app, keeping the exact Tailwind 
classes and responsiveness."
Use Composer. In your new project, hit Ctrl/Cmd + I (Composer) and say: "Scaffold a 
main layout and a Todo component using these styles [Paste Code]. Ensure it uses 
Svelte 5 Runes for state management." 
Step C: Firebase Integration
Use the Firebase Prototyping Agent or Gemini's large context to write your firebase.js 
config. 
Prompt: "Set up a Firebase Firestore module for a Todo app. I need functions to 
addTodo, toggleTodo, and deleteTodo. Use the modular Firebase v10+ syntax." 
Why this works:
Context: By using Gemini 1.5 Pro via API key, you can feed the AI your entire existing 
repo as context.
Speed: Cursor's "Composer" mode (Ctrl+I) can write to multiple files at once, allowing 
you to scaffold the +layout.svelte, +page.svelte, and firebase.js in a single prompt. 


from 
https://www.google.com/search?q=free+ai+coding+in+vscode&sca_esv=ea93df226f1c6708&sxsrf=ANbL-n7sBC62pRrzsT6RHY6ZQK2wTQDASg%3A1771153036479&udm=50&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpmAsnXCN5UBx17opt8eaTX5ijYCyJdSZFM4mewRGuivaHuHursf-soOk0JbfkgzOIi1ZPsNSh18l54qW-c2NyuZ_Q8DPZnUuFyioJW7j9ei4zvJRBn8rQUwbZP6aoSSCYta5Ouoyrs9EwrNLb7CF6selkST45US3WSfGVSgVm4v_qvdMhNizMY_j5Y-Goo7IyDpO8_g&aep=1&ntc=1&sa=X&ved=2ahUKEwjU7dOcq9uSAxVQXUEAHb3QBCcQ2J8OegQIChAE&biw=1376&bih=703&dpr=2&mstk=AUtExfDxxPnPF0OxHfLaGmh1lMOZq0g-OW8YZgm9Z_EX0kBa8HgnexeTfQRRPBLgftMuSN5qT5crROOPtBz1zemm5Rvc0eGcfjsn7v6MnFfOAZEkCfQDXxQj2grEoVWQv-zqOLzhUq-QlwIWjeB_gaDQBaXOowD7pVMeX-z_XH07eQ23mKqeTIp2ik3mkV-nuBlUN2mnagqItP_dpVrVkDtnsHA6NIQ3a6cxoME3_Q1_XMzfpp3wNkDZo0a0Qkxtd4klbPcnLPZhqPJOIwaNAk1_WK7qnpJbp2yz9GqiPSzsLKAVHrc9pwoW2hGxlIdx4-wxYiLKlBSmpQUBC9-YR-X_q1i2rGQavm4Qhw&csuir=1&mtid=kaaRafYOr5yFsg_90rbwBQ

