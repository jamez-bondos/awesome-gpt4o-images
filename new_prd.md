Build a web app to allow user fill a form and turn the content of the form into Markdown syntax, so that they can copy and paste the result . Below are the requirement and exmaple:

Requirement:
1. The web app should support both Chinese and English, there should be a switch with logo at the top right corner to switch language
2. There should be a form (card) to allow user enter new exmaple information. There should be two tabs in this card, Chinese and English. 
3. The page should have the Title: Awesome GPT-4o Images Helper. Below it, there should be small sub title: Turn new exmaple to Markdown syntax in a cliked. 
4. There should be a description about this tool and insturction: This tool is designed to help you easily add new examples to the awesome-gpt4o-images repository. Fill the form and click generate to get the formated Markdown syntax.
6. The page should have a left and right panel. The left panel is the form to fill the information, the right panel is the preview of the Markdown syntax.
7. After the user fill the form they can click the generate button to get the formated Markdown syntax as shown in the example below.
8. The markdown preview section should have a tab to switch between Chinese and English.
9. The markdown preview section should have a button to copy the Markdown syntax to the clipboard.
10. The markdown preview section should generate a link for Table of Content in markdown format. For Chinese: [案例 {example_number}：{example_title_cn} (by {example_author})](#examples-{example_number})
11. The markdown preview section should generate a link for Table of Content in markdown format. For English: [Example {example_number}: {example_title_en} (by {example_author})](#examples-{example_number})
12. The chinese and english tab for the form and preview should change together when user toggle in one of them.

Design Requirement:
1. Use Bento Grid style for the visual layout and deisgn.
2. Use mordenized style and techy style.
3. Use high contrast corlor and gradient to make it looks modern and techy.
4. Use professional Font libary such as Font Awesome and Maerial Icons


Exmaple: 
Template.md: 

# 中文案例

<a id="{exmaple_number}"></a>
## 案例 {exmaple_number}：{exmaple_title_cn} (by [{exmaple_author}]({author_url}))

[原文链接]({source_url})

<img src="{exmaple_image_url}" width="300" alt="{exmaple_image_alt}">

**提示词：**
```
{exmaple_prompt_cn}
```

*注意： {exmaple_note}*

**需上传参考图片：** {exmaple_reference_image}

[⬆️ 返回案例目录](#example-toc)


Template_en.md: 

# English Example

<a id="{exmaple_number}"></a>
## Example {exmaple_number}: {exmaple_title_en} (by [{exmaple_author}]({author_url}))

[Source Link]({source_url})

<img src="{exmaple_image_url}" width="300" alt="{exmaple_image_alt}">

**Prompt:**
```
{exmaple_prompt_en}
```

*Note: {exmaple_note_en}*

**Reference Image Required: ** {exmaple_reference_image}

[⬆️ Back to Directory](#example-toc)


---

## Improvements to make:
1. Correct the Chinese and English usage in the form and preview. (Done ✅)
2. Add required the optional field in the form (Done ✅)
3. Add a form validation (Done ✅)
4. Add space after the template title (Done ✅)
5. Improve the description and instruction in the tool (Done ✅)
6. Add more graphic to the tool to make it looks more modern and techy
7. Add upload image function and allow copy paste and drag and drop image 
