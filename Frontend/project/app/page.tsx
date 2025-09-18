"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/app/theme-context";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const cancerTypes = ["Stomach", "Lung", "Breast", "Colon", "Prostate", "Liver"];
const cancerEmojis: Record<string, string> = {
  stomach: "🍽️",
  lung: "🫁",
  breast: "🎀",
  colon: "🧠",
  prostate: "🥒",
  liver: "🧫",
};

const tissueDescriptions: Record<string, string> = {
  ADI: "ADI: Adipose (fat tissue) 🧈\nClusters of lipid-filled cells that store energy and provide cushioning around organs. In histology, adipose appears as large, clear vacuoles pushing the nucleus to the cell edge.",
  DEB: "DEB: Debris (cellular waste) 🗑️\nFragments of dead cells and extracellular material left behind after tissue breakdown. Often seen as irregular, granular clumps outside healthy cells.",
  LYM: "LYM: Lymphocytes (immune cells) 🛡️\nSmall, round white blood cells responsible for mounting immune responses. They have a dense nucleus and scant cytoplasm, congregating where inflammation occurs.",
  MUC: "MUC: Mucus (protective secretion) 🧴\nGel-like substance secreted by epithelial cells that lubricates and protects tissue surfaces. Appears as amorphous, lightly stained pools between cells.",
  MUS: "MUS: Smooth Muscle (muscle tissue) 💪\nSpindle-shaped cells forming layers in the colon wall that help propel contents. Under microscope, they’re elongated with centrally placed nuclei.",
  NORM: "NORM: Normal Colon Mucosa (healthy tissue for reference) 🌱\nWell-organized epithelial lining with regular glandular crypts and uniform cell shape. Serves as the baseline “healthy” pattern against which pathology is judged.",
  STR: "STR: Cancer-associated Stroma (connective tissue around the tumor) 🕸️\nFibrous support tissue co-opted by a growing tumor, rich in collagen, blood vessels, and fibroblasts. Often shows desmoplastic (scar-like) changes and supports tumor invasion.",
  TUM: "TUM: Tumor (cancerous tissue) 🦠\nDensely packed, irregularly shaped cells exhibiting abnormal nuclei and loss of normal architecture. Indicates active neoplastic growth and invasion potential.",
};

function TitleWithEmoji({ selectedCancer, title }: { selectedCancer: string; title: string }) {
  const emoji = cancerEmojis[selectedCancer] || "🧫";
  return <h2 className="text-xl md:text-2xl font-semibold">{emoji} {title}</h2>;
}

function getThemeClass(type: string) {
  return `theme-${type.toLowerCase()}`;
}

export default function HomePage() {
  const [selectedCancer, setSelectedCancer] = useState(cancerTypes[0]);
  const { setTheme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [categoryKey, setCategoryKey] = useState(0);
  const [id, setID] = useState(-1);
  const [resultType, setResultType] = useState<string | null>(null);
  const [resultDescription, setResultDescription] = useState<string>("");

  useEffect(() => {
    setTheme(selectedCancer);
  }, [setTheme, selectedCancer]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:8000/model/", { method: "POST", body: formData });
      if (!response.ok) {
        alert("Upload failed");
      } else {
        const data = await response.json();
        alert("Upload successful: " + JSON.stringify(data));
        setID(data.id);
      }
    } catch (error) {
      alert(error as any);
    }
  };

  const retrieveEval = async (id: number) => {
    const jsonToSend = { id };
    try {
      const response = await fetch("http://localhost:8000/predict/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonToSend),
      });
      if (!response.ok) {
        alert("Request failed");
      } else {
        const data = await response.json();
        const weights = data.classification;
        let maxIndex = 0;
        for (let i = 1; i < weights.length; i++) if (weights[maxIndex] < weights[i]) maxIndex = i;
        setResultType(["ADI", "MUS", "NOR", "DEB", "LYM", "MUC", "STR", "TUM"][maxIndex]);
        return resultType;
      }
    } catch (error) {
      alert("Error: " + error);
    }
  };

  useEffect(() => {
    if (resultType && tissueDescriptions[resultType]) setResultDescription(tissueDescriptions[resultType]);
    else setResultDescription("");
  }, [resultType]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCancer(e.target.value);
    setCategoryKey((prev) => prev + 1);
  };

  return (
    <>
      {/* subtle radial bg */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(35rem_35rem_at_50%_-10%,oklch(0.98_0_0),transparent)]" />
      <div className={`py-12 md:py-16 flex flex-col items-center gap-10 md:gap-14 min-h-screen ${getThemeClass(selectedCancer)}`}>
        <AnimatePresence mode="wait">
          <Card className="glass-card w-full max-w-2xl">
            <CardContent className="py-8">
              <motion.h1
                key={categoryKey}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--primary)] drop-shadow-sm">
                  DeepCure
                </div>
                <div className="mt-4 flex justify-center">
                  <Image src="/img.png" alt="Logo" width={64} height={64} className="rounded-xl" />
                </div>
              </motion.h1>
            </CardContent>
          </Card>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-3xl space-y-6"
        >
          <Card className="glass-card">
            <CardContent className="text-center space-y-4 py-8">
              <CardTitle className="flex flex-col items-center gap-3">
                <span className="flex flex-col items-center gap-2">
                  <select
                    className="text-lg md:text-2xl font-semibold rounded-xl border-input bg-background/70 px-3 py-2 outline-none ring-0 focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-4 transition"
                    value={selectedCancer}
                    onChange={handleCategoryChange}
                  >
                    {cancerTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <TitleWithEmoji selectedCancer={selectedCancer.toLowerCase()} title="Cancer Detection AI" />
                </span>
              </CardTitle>
              <CardDescription className="text-base">
                Upload an endoscopic image and let our CNN model determine whether there was cancer.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="flex flex-col items-center gap-4 md:gap-6 py-8">
              <Input type="file" accept="image/*" className="w-full h-11 rounded-xl" onChange={handleFileChange} />
              <Button className="w-full h-11 rounded-xl" onClick={handleUpload} disabled={!file}>
                Analyze Image
              </Button>
              <Button className="w-full h-11 rounded-xl" onClick={() => retrieveEval(id)} disabled={id == -1} variant="secondary">
                Get Result
              </Button>
            </CardContent>
          </Card>

          {resultDescription && (
            <div className="max-w-2xl mx-auto my-6 p-5 rounded-xl border bg-muted/60 shadow-sm">
              <pre className="whitespace-pre-wrap text-base leading-relaxed">{resultDescription}</pre>
            </div>
          )}

          <footer className="w-full text-center text-sm text-muted-foreground mt-12">
            <div>React + Next · Django · © {new Date().getFullYear()} </div>
            <div className="flex justify-center gap-3 mt-6">
              <Button asChild variant="outline" className="w-40 rounded-xl"><a href="/about">About</a></Button>
              <Button asChild variant="outline" className="w-40 rounded-xl"><a href="/info">Info</a></Button>
              <Button asChild variant="outline" className="w-40 rounded-xl"><a href="/home">Home</a></Button>
            </div>
            <div className="space-x-2 mt-4">
              <a href="https://github.com/leotuckey/DeepCure" target="_blank" rel="noopener noreferrer" className="underline text-[var(--primary)]">Info</a>
              <span>·</span>
              <a href="https://github.com/leotuckey/DeepCure" target="_blank" rel="noopener noreferrer" className="underline text-[var(--primary)]">Source</a>
              <span>·</span>
              <a href="https://github.com/leotuckey/DeepCure" target="_blank" rel="noopener noreferrer" className="underline text-[var(--primary)]">Contact Us</a>
            </div>
          </footer>
        </motion.div>
      </div>
    </>
  );
}
