import "./App.css";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";
import { useState } from "react";

function App() {
  const mdParser = new MarkdownIt();
  const uploadedUrl =
    "https://avatars.githubusercontent.com/u/48675598?v=4&key=";
  let mdEditor;

  const [mdData, setMdData] = useState({ mdText: null, imageUrls: [] });

  function handleEditorChange({ html, text }) {
    console.log({ html, text });
  }

  function getMdValue() {
    if (mdEditor) {
      console.log({ mdEditor });
      alert(mdEditor.getMdValue());
    }
  }

  function handleImageUpload(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (data) => {
        const randomizedUrl = uploadedUrl + Math.random(10);
        setMdData((prevState) => ({
          ...mdData,
          imageUrls: [randomizedUrl, ...prevState.imageUrls],
        }));
        resolve(randomizedUrl);
      };
      reader.readAsDataURL(file);
    });
  }

  function onCustomImageUpload(event) {
    console.log({
      caller: onCustomImageUpload.name,
      event,
    });
    return new Promise((resolve, reject) => {
      const result = window.prompt("Please enter image url here...");
      resolve({ url: result });
    });
  }

  return (
    <div>
      {mdData?.imageUrls?.map((imageUrl, i) => {
        return (
          <div
            style={{
              display: "flex",
              padding: 10,
              justifyContent: "space-around",
            }}
            key={i}
          >
            <div>{imageUrl}</div>
            <button
              onClick={() => {
                mdEditor.setText(
                  mdEditor
                    .getMdValue()
                    ?.replace(
                      RegExp(
                        `!\\[(.*)\\]\\(${imageUrl
                          .replaceAll(`/`, `\\/`)
                          .replaceAll(`?`, `\\?`)}\\)`
                      ),
                      ""
                    )
                );
                setMdData({
                  ...mdData,
                  imageUrls: mdData.imageUrls.filter((iU) => iU != imageUrl),
                });
              }}
            >
              remove
            </button>
          </div>
        );
      })}
      <MdEditor
        ref={(node) => {
          mdEditor = node;
        }}
        style={{ height: "500px" }}
        renderHTML={(rawText) => mdParser.render(rawText)}
        // onChange={handleEditorChange}
        onImageUpload={handleImageUpload}
        // onCustomImageUpload={onCustomImageUpload}
        allowPasteImage
      />
    </div>
  );
}

export default App;
