interface FormData {
  example_number: string;
  example_title_cn: string;
  example_title_en: string;
  example_author: string;
  author_url: string;
  source_url: string;
  example_image_url: string;
  example_image_alt: string;
  example_prompt_cn: string;
  example_prompt_en: string;
  example_note: string;
  example_note_en: string;
  example_reference_image: string;
}

export function generateChineseMarkdown(formData: FormData): string {
  // Create markdown sections
  const header = `<a id="examples-${formData.example_number}"></a>
## 案例 ${formData.example_number}：${formData.example_title_cn} (by [${formData.example_author}](${formData.author_url}))

[原文链接](${formData.source_url})

<img src="${formData.example_image_url}" width="300" alt="${formData.example_image_alt}">

**提示词：**
\`\`\`
${formData.example_prompt_cn}
\`\`\`
`;

  // Only include note section if there's content
  const noteSection = formData.example_note && formData.example_note.trim() 
    ? `\n\n*注意： ${formData.example_note}*` 
    : '';

  const footer = `\n\n**需上传参考图片：** ${formData.example_reference_image}

[⬆️ 返回案例目录](#example-toc)

`;

  // Combine all sections
  return header + noteSection + footer;
}

export function generateEnglishMarkdown(formData: FormData): string {
  // Create markdown sections
  const header = `<a id="examples-${formData.example_number}"></a>
## Example ${formData.example_number}: ${formData.example_title_en} (by [${formData.example_author}](${formData.author_url}))

[Source Link](${formData.source_url})

<img src="${formData.example_image_url}" width="300" alt="${formData.example_image_alt}">

**Prompt:**
\`\`\`
${formData.example_prompt_en}
\`\`\`
`;

  // Only include note section if there's content
  const noteSection = formData.example_note_en && formData.example_note_en.trim() 
    ? `\n\n*Note: ${formData.example_note_en}*`
    : '';

  const footer = `\n\n**Reference Image Required:** ${formData.example_reference_image}

[⬆️ Back to Directory](#example-toc)

`;

  // Combine all sections
  return header + noteSection + footer;
}

export function generateTocLink(formData: FormData, language: "en" | "cn"): string {
  if (language === "cn") {
    return `*   [案例 ${formData.example_number}：${formData.example_title_cn} (by @${formData.example_author})](#examples-${formData.example_number})`;
  } else {
    return `*   [Example ${formData.example_number}: ${formData.example_title_en} (by @${formData.example_author})](#examples-${formData.example_number})`;
  }
} 