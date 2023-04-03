import LoadingDots from "@/components/LoadingDots";
import Head from "next/head";
import { useState, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import styles from "@/styles/CoverLetter.module.css";
import { extractText } from "@/utils/TextExtractor";
import DragDropFile from "@/components/DragDropFile";

export default function CoverLetter() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [resume, setResume] = useState("");
  const [generatedCover, setGeneratedCover] = useState<String>("");

  const coverRef = useRef<null | HTMLDivElement>(null);
  const maxTokens = 2000;

  const scrollToCover = () => {
    if (coverRef.current !== null) {
      coverRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prompt = `Generate a professional cover letter, no more than 4 paragraphs, for the ${role} position at the company ${company}. Make sure to include details about what they do and how I would be a good fit. Don't include my address or other personal information. Makes sure there are ZERO grammatical or syntactical mistakes. Here is my resume (paraphrase, do not copy directly): ${resume}`;

  console.log(prompt);
  const generateCover = async (e: any) => {
    e.preventDefault();
    setGeneratedCover("");
    if (role.length == 0) {
      return;
    }
    if (company.length == 0) {
      return;
    }
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        maxTokens: maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      let chunkValue = decoder.decode(value);
      chunkValue = JSON.parse(
        JSON.stringify(chunkValue).replace(/\n/g, "<br>")
      );
      setGeneratedCover((prev) => prev + chunkValue);
    }
    scrollToCover();
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Write A Cover Letter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <div className="max-w-3xl w-full">
          <h1 className="mt-0 w-full mb-2 text-5xl font-medium leading-tight text-primary">
            Write A Cover Letter
          </h1>
          <div className="flex mt-10 items-center space-x-1">
            <p className="text-left font-medium">Role</p>
          </div>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            minLength={1}
            required
            className="g-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-100 focus:border-sky-100 block w-full p-2.5"
            placeholder={"e.g. Full Stack Engineer."}
          />

          <div className="flex mt-10 items-center space-x-1">
            <p className="text-left font-medium">Company</p>
          </div>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            minLength={1}
            required
            className="g-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-100 focus:border-sky-100 block w-full p-2.5"
            placeholder={"e.g. Google"}
          />

          <div className="flex mt-10 items-center space-x-1">
            <p className="text-left font-medium">Resume (optional)</p>
          </div>
          <div>
            <DragDropFile file={resume} setFile={setResume} />
            <p
              className="mt-1 text-sm text-gray-500 dark:text-gray-30"
              style={{ display: "flex" }}
              id="file_input_help"
            >
              PDF, DOC, or DOCX (MAX. 10 MB).
            </p>
          </div>
          {!loading && (
            <button
              className="bg-cyan-900 rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 h-12 hover:bg-cyan-900/80 w-full"
              onClick={(e) => generateCover(e)}
            >
              Create your cover letter &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-cyan-900 rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 h-12 hover:bg-cyan-900/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {generatedCover && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={coverRef}
                >
                  Your generated cover letter
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                <div
                  className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCover.toString());
                    toast("Cover letter copied to clipboard", {
                      icon: "✂️",
                    });
                  }}
                >
                  <p className={styles.cover}>{generatedCover}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
