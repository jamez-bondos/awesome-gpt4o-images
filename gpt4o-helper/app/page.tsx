"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, Globe, Check, ChevronRight } from "lucide-react"
import { translations } from "@/lib/translations"
import { 
  generateChineseMarkdown, 
  generateEnglishMarkdown, 
  generateTocLink 
} from "@/lib/markdown-templates"

export default function Home() {
  const [uiLanguage, setUiLanguage] = useState<"en" | "cn">("en")
  const [formLanguage, setFormLanguage] = useState<"en" | "cn">("en")
  const [formData, setFormData] = useState({
    example_number: "",
    example_title_cn: "",
    example_title_en: "",
    example_author: "",
    author_url: "",
    source_url: "",
    example_image_url: "",
    example_image_alt: "",
    example_prompt_cn: "",
    example_prompt_en: "",
    example_note: "",
    example_note_en: "",
    example_reference_image: "",
  })

  const [markdown, setMarkdown] = useState({
    cn: "",
    en: "",
  })

  const [copied, setCopied] = useState({
    markdown: false,
    toc: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generateMarkdown = () => {
    // Generate markdown using template functions
    const cnMarkdown = generateChineseMarkdown(formData)
    const enMarkdown = generateEnglishMarkdown(formData)

    setMarkdown({
      cn: cnMarkdown,
      en: enMarkdown,
    })
  }

  const handleGenerateTocLink = () => {
    return generateTocLink(formData, formLanguage)
  }

  const copyToClipboard = () => {
    const textToCopy = formLanguage === "cn" ? markdown.cn : markdown.en
    navigator.clipboard.writeText(textToCopy)
    setCopied((prev) => ({ ...prev, markdown: true }))
    setTimeout(() => setCopied((prev) => ({ ...prev, markdown: false })), 2000)
  }

  const copyTocToClipboard = () => {
    navigator.clipboard.writeText(handleGenerateTocLink())
    setCopied((prev) => ({ ...prev, toc: true }))
    setTimeout(() => setCopied((prev) => ({ ...prev, toc: false })), 2000)
  }

  // Switch both tabs when language changes
  useEffect(() => {
    const formTab = document.querySelector(
      `[data-state="active"][data-value="${formLanguage === "cn" ? "en" : "cn"}"]`,
    ) as HTMLElement
    if (formTab) {
      formTab.click()
    }
  }, [formLanguage])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500">
              {translations[uiLanguage].title}
            </h1>
            <p className="text-gray-300 mt-2">{translations[uiLanguage].subtitle}</p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-black/20 border-gray-700 hover:bg-black/40"
            onClick={() => setUiLanguage(uiLanguage === "en" ? "cn" : "en")}
          >
            <Globe className="h-4 w-4" />
            {uiLanguage === "en" ? translations.en.languageCn : translations.en.languageEn}
          </Button>
        </div>

        {/* Description */}
        <Card className="mb-8 bg-black/20 border-gray-700 text-gray-200">
          <CardContent className="pt-6">
            <p>{translations[uiLanguage].description}</p>
          </CardContent>
        </Card>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-6">
            <Card className="bg-black/20 border-gray-700 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-800/50 to-violet-800/50">
                <CardTitle className="text-white">{translations[uiLanguage].formTitle}</CardTitle>
                <CardDescription className="text-gray-300">{translations[uiLanguage].formDescription}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Title, Prompt, and Note fields at the top */}
                  <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid grid-cols-2 bg-black/30">
                      <TabsTrigger value="en" onClick={() => setFormLanguage("en")}>
                        {translations[uiLanguage].languageEn}
                      </TabsTrigger>
                      <TabsTrigger value="cn" onClick={() => setFormLanguage("cn")}>
                        {translations[uiLanguage].languageCn}
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="en" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="example_title_en">{translations[uiLanguage].titleEn}</Label>
                        <Input
                          id="example_title_en"
                          name="example_title_en"
                          value={formData.example_title_en}
                          onChange={handleInputChange}
                          className="bg-black/30 border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="example_prompt_en">{translations[uiLanguage].promptEn}</Label>
                        <Textarea
                          id="example_prompt_en"
                          name="example_prompt_en"
                          value={formData.example_prompt_en}
                          onChange={handleInputChange}
                          className="bg-black/30 border-gray-700 min-h-[150px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="example_note_en">{translations[uiLanguage].noteEn}</Label>
                        <Input
                          id="example_note_en"
                          name="example_note_en"
                          value={formData.example_note_en}
                          onChange={handleInputChange}
                          className="bg-black/30 border-gray-700"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="cn" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="example_title_cn">{translations[uiLanguage].titleCn}</Label>
                        <Input
                          id="example_title_cn"
                          name="example_title_cn"
                          value={formData.example_title_cn}
                          onChange={handleInputChange}
                          className="bg-black/30 border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="example_prompt_cn">{translations[uiLanguage].promptCn}</Label>
                        <Textarea
                          id="example_prompt_cn"
                          name="example_prompt_cn"
                          value={formData.example_prompt_cn}
                          onChange={handleInputChange}
                          className="bg-black/30 border-gray-700 min-h-[150px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="example_note">{translations[uiLanguage].noteCn}</Label>
                        <Input
                          id="example_note"
                          name="example_note"
                          value={formData.example_note}
                          onChange={handleInputChange}
                          className="bg-black/30 border-gray-700"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-700"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-black/30 px-2 text-gray-400">
                        {translations[uiLanguage].additionalFields}
                      </span>
                    </div>
                  </div>

                  {/* Rest of the fields at the bottom */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="example_number">{translations[uiLanguage].exampleNumber}</Label>
                        <Input
                          id="example_number"
                          name="example_number"
                          value={formData.example_number}
                          onChange={handleInputChange}
                          className="bg-black/30 border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="example_author">{translations[uiLanguage].author}</Label>
                        <Input
                          id="example_author"
                          name="example_author"
                          value={formData.example_author}
                          onChange={handleInputChange}
                          className="bg-black/30 border-gray-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author_url">{translations[uiLanguage].authorUrl}</Label>
                      <Input
                        id="author_url"
                        name="author_url"
                        value={formData.author_url}
                        onChange={handleInputChange}
                        className="bg-black/30 border-gray-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="source_url">{translations[uiLanguage].sourceUrl}</Label>
                      <Input
                        id="source_url"
                        name="source_url"
                        value={formData.source_url}
                        onChange={handleInputChange}
                        className="bg-black/30 border-gray-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="example_image_url">{translations[uiLanguage].imageUrl}</Label>
                      <Input
                        id="example_image_url"
                        name="example_image_url"
                        value={formData.example_image_url}
                        onChange={handleInputChange}
                        className="bg-black/30 border-gray-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="example_image_alt">{translations[uiLanguage].imageAlt}</Label>
                      <Input
                        id="example_image_alt"
                        name="example_image_alt"
                        value={formData.example_image_alt}
                        onChange={handleInputChange}
                        className="bg-black/30 border-gray-700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="example_reference_image">{translations[uiLanguage].referenceImage}</Label>
                      <Input
                        id="example_reference_image"
                        name="example_reference_image"
                        value={formData.example_reference_image}
                        onChange={handleInputChange}
                        className="bg-black/30 border-gray-700"
                        placeholder="Yes/No"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-black/30 border-t border-gray-700 flex justify-end p-4">
                <Button
                  onClick={generateMarkdown}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  {translations[uiLanguage].generateButton}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card className="bg-black/20 border-gray-700 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-cyan-800/50 to-blue-800/50">
                <CardTitle className="text-white">{translations[uiLanguage].previewTitle}</CardTitle>
                <CardDescription className="text-gray-300">
                  {translations[uiLanguage].previewDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue={formLanguage} className="w-full">
                  <TabsList className="grid grid-cols-2 bg-black/30">
                    <TabsTrigger value="en" onClick={() => setFormLanguage("en")}>
                      {translations[uiLanguage].languageEn}
                    </TabsTrigger>
                    <TabsTrigger value="cn" onClick={() => setFormLanguage("cn")}>
                      {translations[uiLanguage].languageCn}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="en" className="mt-4">
                    <div className="bg-black/30 p-4 rounded-md border border-gray-700 overflow-auto max-h-[500px]">
                      <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                        {markdown.en || translations[uiLanguage].previewPlaceholder}
                      </pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="cn" className="mt-4">
                    <div className="bg-black/30 p-4 rounded-md border border-gray-700 overflow-auto max-h-[500px]">
                      <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                        {markdown.cn || translations[uiLanguage].previewPlaceholderCn}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* TOC Link */}
                <div className="mt-6 space-y-2">
                  <Label>{translations[uiLanguage].tocLink}</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-black/30 p-3 rounded-md border border-gray-700 text-gray-300 text-sm overflow-x-auto">
                      {handleGenerateTocLink()}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-black/20 border-gray-700 hover:bg-black/40"
                      onClick={copyTocToClipboard}
                    >
                      {copied.toc ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-black/30 border-t border-gray-700 flex justify-end p-4">
                <Button
                  variant="outline"
                  className="bg-black/20 border-gray-700 hover:bg-black/40 flex items-center gap-2"
                  onClick={copyToClipboard}
                >
                  {copied.markdown ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied.markdown ? translations[uiLanguage].copied : translations[uiLanguage].copyButton}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
