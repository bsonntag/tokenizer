import { useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [image, setImage] = useState();
  const [size, setSize] = useState(256);

  return (
    <div className={styles.page}>
      <form
        className={styles.form}
        onSubmit={async (event) => {
          event.preventDefault();
          const formData = new FormData(event.target);
          const response = await fetch("/api/tokenize", {
            method: "POST",
            body: formData,
          });
          const blob = await response.blob();
          const downloadLink = document.createElement("a");
          const fileName = formData.get("image").name.replace(/\.\w+$/, "");
          downloadLink.download = fileName + "-token.png";
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.click();
        }}
      >
        <label className={styles.field}>
          Image
          <input
            name="image"
            type="file"
            accept=".jpg, .jpeg, .png"
            required
            onChange={(event) => {
              setImage(URL.createObjectURL(event.target.files[0]));
            }}
          />
        </label>
        <label className={styles.field}>
          Border color
          <input name="color" type="color" required defaultValue="#8a2424" />
        </label>
        <label className={styles.field}>
          Size
          <input
            name="size"
            type="number"
            required
            defaultValue="256"
            onChange={(event) => setSize(event.target.value)}
          />
        </label>
        <button type="submit">Tokenize</button>
      </form>

      {image && (
        <>
          <p>Preview:</p>
          <div
            className={styles.preview}
            style={{
              "--border-width": parseInt(size) * 0.04 + "px",
              height: size + "px",
              width: size + "px",
            }}
          >
            <img
              alt={"Your token preview"}
              src={image}
              height={size}
              width={size}
            />
          </div>
        </>
      )}
    </div>
  );
}
