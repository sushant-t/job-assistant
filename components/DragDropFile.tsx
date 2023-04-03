import { extractText } from "@/utils/TextExtractor";
import React, { DragEventHandler } from "react";
import styles from "../styles/CoverLetter.module.css";

const DragDropFile = (props: any) => {
  const [dragActive, setDragActive] = React.useState(false);

  const { file, setFile } = props;
  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // at least one file has been dropped so do something
      // handleFiles(e.dataTransfer.files);
      const text = await extractText(e.dataTransfer.files[0]);
      setFile(text);
    }
  };
  return (
    <form
      action="#"
      className={`relative max-w h-32 bg-slate-200 rounded-lg shadow-inner flex justify-center items-center ${
        dragActive ? styles["drag-active"] : ""
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={async (e) => {
          console.log("file added");
          const fileList = e.target.files;
          if (fileList?.length == 0) return;
          const text = await extractText(fileList![0]);
          console.log("here");
          setFile(text);
        }}
        onClick={(e) => {
          e.currentTarget.value = "";
        }}
      />
      <label
        htmlFor="file-upload"
        id="label-file-upload"
        className="z-20 flex flex-col-reverse items-center justify-center w-full h-full cursor-pointer"
      >
        <p className="z-10 text-xs font-light text-center text-gray-500">
          Drag and drop your files here
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="z-10 w-8 h-8 text-indigo-400 svg-icon inline"
          viewBox="0 0 1024 1024"
          version="1.1"
        >
          <path
            d="M727.466667 714.666667H352c-46.933333 0-85.333333-38.4-85.333333-85.333334V275.2c0-46.933333 38.4-85.333333 85.333333-85.333333h332.8c70.4 0 128 57.6 128 128v309.333333c0 49.066667-38.4 87.466667-85.333333 87.466667z"
            fill="#93A8FF"
          />
          <path
            d="M682.666667 759.466667H307.2c-46.933333 0-85.333333-38.4-85.333333-85.333334V322.133333c0-46.933333 38.4-85.333333 85.333333-85.333333H682.666667c46.933333 0 85.333333 38.4 85.333333 85.333333v352c0 46.933333-38.4 85.333333-85.333333 85.333334z"
            fill="#FCCA1E"
          />
          <path
            d="M768 782.933333H256c-46.933333 0-85.333333-38.4-85.333333-85.333333V366.933333c0-46.933333 38.4-85.333333 85.333333-85.333333h213.333333c25.6 0 49.066667 14.933333 61.866667 38.4l17.066667 25.6c12.8 17.066667 34.133333 27.733333 55.466666 27.733333H768c46.933333 0 85.333333 38.4 85.333333 85.333334v238.933333c0 46.933333-38.4 85.333333-85.333333 85.333333z"
            fill="#2953FF"
          />
        </svg>
      </label>
      {dragActive && (
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </form>
  );
};

export default DragDropFile;
