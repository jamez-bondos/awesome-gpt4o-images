# 📘 Product Requirements Document (PRD)

## 🛠 Project Title
**Awesome GPT-4o Image Manager**

## 🧩 Purpose
To provide a **locally hosted contributor tool** for maintaining the `README.md` (Chinese) and `README_en.md` (English) of the `awesome-gpt4o-images` repository. It allows contributors to **view, add, and edit image examples** in a structured, bilingual, and user-friendly way—without needing to manually write Markdown.

## 📁 Updated Directory Structure
The tool lives inside the `awesome-gpt4o-image-manager/` folder and operates on files/folders in its **parent directory**:

```bash
root/
├───.github/
│   └───ISSUE_TEMPLATE/
├───examples/                           # Image files used by examples
├───references/
├───README.md                           # Chinese version
├───README_en.md                        # English version
├───template.md                         # Bilingual template for new entries
└───awesome-gpt4o-image-manager/        # This tool lives here
    ├── pages/
    ├── components/
    ├── lib/
    └── public/
```

The app will look one level up to locate `README.md`, `README_en.md`, `examples/`, and `template.md`.

## 🔑 Key Features

### 1. **Startup Check & Status Report**
* The app should support Chinese and English. A button on the top right corner to switch between the two languages.
* On app load:
   * Check for the presence of:
      * `../README.md`
      * `../README_en.md`
      * `../examples/`
      * `../template.md`
* Display status with:
   * ✅ Success
   * ❌ Failure (with instructions if missing)

### 2. **Table of Contents (TOC) View**
* Parse `README.md` (Chinese) and `README_en.md` (English)
* Based on the Language selected, show the corresponding TOC:
   * Show example number, title, and author from both versions
   * On click, display a **dual-language card view** with:
      * Image preview
      * Source link
      * Prompts (English + Chinese)
      * Author
      * Buttons: ✏️ Edit | 🗑 Delete (future)

### 3. **Add New Example (Bilingual Tabs)**
* A main button: **➕ Add New Example**
* Displays a form with **two tabs**:
   * **English Tab**:
      * Example number (auto)
      * English title
      * English prompt
      * Source URL
      * Author
      * Image filename or upload
   * **Chinese Tab**:
      * 中文标题
      * 中文提示词
      * 中文作者署名
      * 中文备注（可选）
* **Both tabs must be filled out** before submission
* On submit:
   * Append to both `README.md` and `README_en.md` using correct Markdown block templates
   * Update the appropriate TOC sections in both files
   * Optionally save image to `../examples/`
   * Display success notification

### 4. **Edit Existing Example**
* From TOC or card view:
   * Click ✏️ **Edit**
   * Opens bilingual tabbed form (like add form), prefilled with existing data
* On save:
   * Replace only the specific example block in:
      * `README.md` (Chinese)
      * `README_en.md` (English)
   * Preserve spacing, numbering, and formatting
   * Confirm via toast/message

### 5. **Markdown File Management**
* Use backend Node.js file system methods to:
   * Parse content using regex or `gray-matter` + custom rules
   * Identify example blocks by header patterns:
      * `## Example 68:` (English)
      * `## 案例 68：` (Chinese)
   * Safely update content while preserving structure
* Update example TOC sections as well (with new entries and links)

## 💻 Tech Stack

| Area | Tool/Framework |
|------|----------------|
| Frontend | Next.js (React + TypeScript) |
| Styling | Tailwind CSS |
| Routing | Next.js file-based + dynamic route for `/edit/[id]` |
| Markdown Parsing | `gray-matter`, `remark`, regex utilities |
| File I/O | Node.js `fs` + `path` (with parent directory access) |
| Image Handling | Store in `../examples/` (linked in Markdown) |
| State | React Context or `useReducer` for form + TOC state |
| Tabs UI | Headless UI or Tab component from Shadcn/ui |

## 🧪 Stretch Features (Optional)
* 🔍 Live TOC search
* 🖼 Image preview & uploader with drag-n-drop
* 📤 Export updated README files
* 🔒 Lock example numbers to avoid duplicates
* 🧪 Markdown diff history (version tracking)

## ✅ Acceptance Criteria

| Feature | Criteria |
|---------|----------|
| File check | Reports on presence of `README.md`, `README_en.md`, `examples/` |
| TOC view | Lists bilingual example index, clickable |
| Add example | Fills both language tabs, updates both README files |
| Edit example | Updates corresponding blocks only, keeps numbering intact |
| Image usage | References stored images correctly in examples/ |
| Layout | Clear and intuitive bilingual interface |
