import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, FileText, GraduationCap } from "lucide-react";

const subjects = [
  {
    name: "DTI",
    units: [
      { title: "Unit 1", link: "https://drive.google.com/file/d/11jmxCDW4WAna6kk2wo_CN7NW92IRk4j6/preview" },
      { title: "Unit 2", link: "https://drive.google.com/file/d/1uUQb_IRMfADtYFTZFuvr2ELm4Nwd6D24/preview" },
      { title: "Unit 3", link: "https://drive.google.com/file/d/14M-sMyB8eksLActD6UoeDo-kbPnf5YWM/preview" },
      { title: "Unit 4", link: "https://drive.google.com/file/d/1g0m9k3lhrPqVR7fNNtm8yY2pn6x_36Rq/preview" },
      { title: "Unit 5", link: "https://drive.google.com/file/d/1LzVigqGNDwt6ftf4sbQY9wnGSjF2Ptm4/preview" },
    ],
  },
  {
    name: "DLCO",
    units: [
      { title: "Unit 1", link: "https://drive.google.com/file/d/1uRJEUurwvtW9CtndyJNNkYNTAJ-WmrMf/preview" },
      { title: "Unit 2", link: "https://drive.google.com/file/d/1jJDAnUnQd0jqowKKaq2kIbz280jdYhRG/preview" },
      { title: "Unit 3", link: "https://drive.google.com/file/d/1TUC01G4AKjaQQwC_nIYzYKDiDcoJcTtv/preview" },
      { title: "Unit 4 & 5", link: "https://drive.google.com/file/d/1_CJHNlH1rXRSWOmdMRi9V3_wFf1Pb8H1/preview" },
    ],
  },
  {
    name: "ADSAA",
    units: [
      { title: "Unit 1", link: "https://drive.google.com/file/d/1VLcBZCZWVOIUme6LOdFqYi01N6LfjCWm/preview" },
    ],
  },
  {
    name: "ES",
    units: [
      { title: "MID-1", link: "https://drive.google.com/file/d/1eJvV21xeAJbrc0iieA0_fwGIK_s2G39E/preview" },
      { title: "MID-2", link: "https://drive.google.com/file/d/1ZEsMW-7NkNWbMOL9Bg3pDojnYv5Na1Ea/preview" },
    ],
  },
  {
    name: "ML",
    units: [
      { title: "Unit 1", link: "https://drive.google.com/file/d/1mOS6bwF81PiruDmvukYh77wPG-9NSiWz/preview" },
      { title: "Unit 2", link: "https://drive.google.com/file/d/1OlYxJXBHvkq0Sm2dwVeMpEj_10pgL6uh/preview" },
      { title: "Unit 3", link: "https://drive.google.com/file/d/1h2Yg8kSrEC3UxBM1JKfH9dJsNeDNdieS/preview" },
    ],
  },
  {
    name: "OT",
    units: [
      { title: "Network Analysis - PERT", link: "https://drive.google.com/file/d/1haXs7J2LXLW6dONsZs_14Dz_mZBrtqy5/preview" },
      { title: "Network Analysis - PERT & CPM", link: "https://drive.google.com/file/d/1gZ8Nf5GAJDoYbrkk537QHVMmz7lV3g55/preview" },
      { title: "NOTES", link: "https://drive.google.com/file/d/1uIUPQijwwFblLWhH2F4WJTSjF4FZApf1/preview" },
    ],
  },
  {
    name: "PS",
    units: [
      { title: "Unit 1", link: "https://drive.google.com/file/d/16q6Gmjjuy8hObp35U6Lat55yKlFZA-kf/preview" },
      { title: "Unit 2", link: "https://drive.google.com/file/d/1iknqTI-66EtRnjKKBfdC6MOUp0tXDg6U/preview" },
      { title: "Unit 3", link: "https://drive.google.com/file/d/1AeRmq4RwhIGgYUHF2McwO972VwUdXQ0O/preview" },
      { title: "Unit 4 & 5", link: "https://drive.google.com/file/d/1FFliIr-zP2_AiXIUxV5_vJPAhfcsdSsy/preview" },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function StudyMaterialsPage() {
  const [selectedSubject, setSelectedSubject] = useState<typeof subjects[0] | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<{ title: string; link: string } | null>(null);

  const handleBack = () => {
    if (selectedUnit) {
      setSelectedUnit(null);
    } else if (selectedSubject) {
      setSelectedSubject(null);
    }
  };

  const breadcrumb = selectedSubject
    ? selectedUnit
      ? `${selectedSubject.name} / ${selectedUnit.title}`
      : selectedSubject.name
    : null;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {(selectedSubject || selectedUnit) && (
            <button
              onClick={handleBack}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[var(--radius)] hover:bg-accent text-muted-foreground transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Study Materials
            </h1>
            {breadcrumb && (
              <p className="text-sm text-muted-foreground mt-1">{breadcrumb}</p>
            )}
            {!breadcrumb && (
              <p className="text-sm text-muted-foreground mt-1">
                Select a subject to access your study materials
              </p>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Subject Selection */}
        {!selectedSubject && (
          <motion.div
            key="subjects"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {subjects.map((subject) => (
              <motion.button
                key={subject.name}
                variants={itemVariants}
                onClick={() => setSelectedSubject(subject)}
                className="group relative flex flex-col items-center gap-4 p-8 rounded-[var(--radius)] bg-card border border-border/40 shadow-card hover:shadow-premium hover:border-primary/30 transition-all duration-200 min-h-[44px]"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-200">
                  <GraduationCap className="h-7 w-7 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">{subject.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {["ES", "OT"].includes(subject.name) ? 5 : subject.units.reduce((count, u) => count + (u.title.includes("&") ? 2 : 1), 0)} unit{subject.units.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Unit Selection */}
        {selectedSubject && !selectedUnit && (
          <motion.div
            key="units"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {selectedSubject.units.map((unit) => (
              <motion.button
                key={unit.title}
                variants={itemVariants}
                onClick={() => setSelectedUnit(unit)}
                className="group flex items-center gap-4 p-5 rounded-[var(--radius)] bg-card border border-border/40 shadow-card hover:shadow-premium hover:border-primary/30 transition-all duration-200 min-h-[44px] text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors duration-200">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{unit.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">View PDF</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* PDF Viewer */}
        {selectedUnit && (
          <motion.div
            key="pdf"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
            className="rounded-[var(--radius)] border border-border/40 shadow-card overflow-hidden bg-card"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/30">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {selectedSubject?.name} — {selectedUnit.title}
              </span>
            </div>
            <iframe
              src={selectedUnit.link}
              className="w-full border-0"
              style={{ height: "calc(100vh - 260px)", minHeight: "500px" }}
              allow="autoplay"
              title={`${selectedSubject?.name} - ${selectedUnit.title}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
