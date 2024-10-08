// src/app/howtoai/lesson1/page.js
"use client"; // This makes the component a Client Component
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore functions
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth to get current user
import { db } from "@/app/api/FirebaseConfig"; // Reference Firestore database
import Image from 'next/image';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export default function Lesson1Page() {
  
  const [sectionsPassed, setSectionsPassed] = useState({}); // To track passed sections
  const [userUID, setUserUID] = useState(null); // Store the current user's UID

  // Fetch the logged-in user's UID dynamically
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUID(user.uid); // Set the userUID from the authenticated user
      } else {
        console.log("No user is signed in");
      }
    });

    // Clean up the subscription to prevent memory leaks
    return () => unsubscribe();
  }, []);

  // Function to update the notebook_lm_exp field in Firestore
  const updateNotebookExperience = async (sectionId) => {
    if (!userUID) return; // Ensure we have the userUID before proceeding

    // Reference the user's document in Firestore
    const userDocRef = doc(db, "userInfoDatabase", userUID);

    try {
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const currentNotebookExp = userData.notebook_lm_exp || 0; // Get current notebook experience value

        // Update Firestore, increment notebook_lm_exp by 1
        await updateDoc(userDocRef, { notebook_lm_exp: currentNotebookExp + 1 });
        console.log(`Notebook LM experience updated for ${sectionId}: ${currentNotebookExp + 1}`);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  useEffect(() => {
    const steps = document.querySelectorAll(".step"); // Select elements with the class "step"
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0.5 // Trigger when 50% of the element is visible
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;

          // Check if this section has already been passed
          if (!sectionsPassed[sectionId]) {
            setSectionsPassed((prev) => ({ ...prev, [sectionId]: true })); // Mark this section as passed
            updateNotebookExperience(sectionId); // Update experience in Firestore

            // Unobserve the element after it's been passed
            obs.unobserve(entry.target);
          }
        }
      });
    }, options);

    steps.forEach((step) => {
      observer.observe(step);
    });

    return () => {
      steps.forEach((step) => {
        observer.unobserve(step);
      });
    };
  }, [sectionsPassed, userUID]); // Add userUID as a dependency

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Lesson 1: Using Google&apos;s Notebook LM</h1>

        <section className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200 text-gray-800">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Lesson Overview</h2>
          <p>In this lesson, you will learn:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>What Google&apos;s Notebook LM is and its capabilities</li>
            <li>How to access and set up Notebook LM</li>
            <li>Basic steps to create and run prompts</li>
            <li>Tips for effective use of the language model</li>
            <li>How to interpret and iterate on results</li>
          </ul>
          <p className="mt-2">
            By the end of this lesson, you&apos;ll be able to start your own projects using Notebook LM and understand its potential for various applications.
          </p>
        </section>

        {/* Step 1, what is notebookLM and how to access it */}
        <section id="step1" className="step mb-8">
          <h2 className="text-3xl font-bold mb-6 text-sky-500 border-b-2 border-sky-300 pb-2">
            Step 1: Getting Started with Google NotebookLM
          </h2>
          <p className="mb-4">
            Let&apos;s get up and running with Google NotebookLM! This tool can help you study and learn much faster and even answer questions you may have based on the material you upload to it. <strong>We&apos;ll dive deeper in this lesson as to what I mean by that.</strong>
          </p>
          <p className="mb-4">
            To get started, you will need a Google account (Gmail) and go to <a 
              href="https://notebooklm.google/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline hover:no-underline font-bold"
            >
              Google Notebook LM
            </a>
          </p>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 my-6">
            <div className="w-full md:w-1/2">
              <Image
                src="/images/notebookLM-homepage.png"
                alt="Google Notebook LM Interface"
                width={400}
                height={225}
                layout="responsive"
                className="rounded-lg shadow-md"
              />
            </div>

            <div className="w-full md:w-1/2">
              <p>
                This is what you should see when you first access Google Notebook LM.
              </p>
              <p className="mt-4">
                <br />
                Go ahead and click on <strong>&quot;Try NotebookLM&quot;</strong>
              </p>
            </div>
          </div>

          {/* Border between "Try NotebookLM and The NoteBooks dashboard" */}
          <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

          <div className="flex flex-col md:flex-row-reverse items-center md:items-start gap-6 my-6">
            <div className="w-full md:w-1/2">
              <Image
                src="/images/notebooks-dashboard.png"
                alt="Google Notebook LM Notebooks Dashboard"
                width={400}
                height={225}
                layout="responsive"
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-xl font-semibold mb-4 mt-2">The Notebooks Dashboard</h3>

              <p>Once you&apos;re logged in, you&apos;ll see the notebooks dashboard. From this dashboard, you can:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Create a new notebook by clicking the &quot;New notebook&quot; button</li>
                <li>Access your existing notebooks</li>
              </ul>
              <br />
              <strong>Let&apos;s make a new notebook, click on &quot;Create&quot;</strong>
            </div>
          </div>
        </section>

        {console.log("Step 2 begins here")}
        {/* ************ Step 2 : Making  Notebook */}
        <section id="step2" className="step mb-12">
          <h2 className="text-3xl font-bold mb-6 text-sky-500 border-b-2 border-sky-300 pb-2">
            Step 2: Making a Notebook
          </h2>

          <p className="mb-4 text-lg">
            In order to work with NotebookLM you must upload sources.
            Thankfully we can upload different kinds of sources, not just PDFs.
            For this lesson we will upload a website link to Harvard&apos;s guide for prompting text-generative based models such as Google NotebookLM:
          </p>

          {/* New subsection: What is a prompt? */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 my-6 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-2 text-blue-800">Before we move forward, <strong>what is a prompt?</strong></h3>
            <p className="mb-2 text-sm text-gray-700">
              In simple terms, a prompt can be a question or command that you type into the AI tool, which gives you an answer based on the prompt.
              <br />
              In order to get the best answer possible, we need to make a good prompt. 
            </p>
            <p className="text-sm text-gray-700">
              Effective prompting is key to getting the most out of AI tools. It involves clearly communicating your intent and providing enough context for accurate responses.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 my-8">
            <div className="w-full lg:w-1/2">
              <Image
                src="/images/upload-sources.png"
                alt="Creating a new notebook in NotebookLM"
                width={600}
                height={338}
                layout="responsive"
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <h3 className="text-xl font-semibold mb-4">Creating a New Notebook</h3>
              <ol className="list-decimal list-inside space-y-2 text-lg">
                <li>Copy the following link of Harvards prompt guide: <a 
                  href="https://huit.harvard.edu/news/ai-prompts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline hover:no-underline font-bold"
                >
                  Harvard&apos;s AI Prompts Guide
                </a></li>
                <li>Under &quot;Link&quot; click on &quot;website&quot; and paste the Prompt Guide link in the search box.</li>
                <li>After pasting the link, click on &quot;Insert&quot;</li>
                <li>Hooray! You have created a new notebook that is trained on Harvards&apos; article for getting started with prompts</li>
              </ol>
            </div>
          </div>

          {/* Step 2 subsection: What does "trained" mean in AI? */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 my-6 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-2 text-green-800">What does &quot;trained&quot; mean in AI?</h3>
            <p className="mb-2 text-sm text-gray-700">
              When we say an AI model is &quot;trained&quot; on certain data, it means the model has analyzed and learned patterns from that data. In the context of NotebookLM:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li> NotebookLM processes the documents or websites you upload.</li>
              <li>It learns the content, context, and relationships within the data.</li>
              <li>This allows the AI to understand and answer questions about the specific information in your uploaded sources.</li>
              <li>It is important to understand where an AI model gets its data from. The Notebook you just created will only be trained on the sources you give it, and not general knowledge like other models such as GPT. This is perfect for studying and making sure the AI gives you answers that are based only on certain data</li>
            </ul>
            <p className="mt-2 text-sm text-gray-700">
              This &quot;training&quot; enables NotebookLM to provide more accurate and relevant responses based on your specific documents, rather than just general knowledge.
            </p>
          </div>
        </section>

        {/* NEW SECTION: STEP 3 - Prompting NotebookLM */}
        {console.log("Step 3 begins here")}
        <section id="step3" className="step mb-12">
          <h2 className="text-3xl font-bold mb-6 text-sky-500 border-b-2 border-sky-300 pb-2">
            Step 3: Interacting with your NotebookLM
          </h2>

            <p className="mb-4 text-lg">
              Now that you&apos;ve uploaded your source (Harvard&apos;s AI Prompts Guide and trained your notebookLM, let&apos;s explore how to interact with it effectively.
            </p>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 my-8">
              <div className="w-full lg:w-1/2">
                <Image
                  src="/images/notebook-created.png"
                  alt="NotebookLM Interface"
                  width={600}
                  height={338}
                  layout="responsive"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <h3 className="text-xl font-semibold mb-4">Prompting your trained NotebookLM</h3>
                <ol className="list-decimal list-inside space-y-2 text-lg">
                  <li>Now you can type your question/prompt in the input box at the bottom of the screen and press enter to get a response.</li>
                  <li>Try asking your notebook <strong>&quot;What makes a good prompt?&quot;</strong></li>
                  <li>You may get a long, confusing response, and that&apos;s ok! You can add context to change the response your notebook gives you </li>
                  <li>You will see some suggested prompts from notebookLM under your answer, and you can use those if you like.</li>
                </ol>
              </div>
            </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 my-6">
            <h3 className="text-xl font-semibold mb-2 text-yellow-800">Copy and paste these example prompts to see NotebookLM&apos;s potential</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>&quot;What makes a good prompt? Explain it to me as if I have never used an AI tool before.&quot;</li>
              <li>&quot;What are some kind of details I should include in my prompts to get better answers?&quot; </li>
              <li>&quot;Give me a summary of the Harvard Prompt data source, I want to explain prompts to my little sister&quot;</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 my-6">
            <h3 className="text-xl font-semibold mb-2 text-purple-800">Understanding Context in AI Interactions</h3>
            <p className="mb-2 text-sm text-gray-700">
              Context is crucial in AI interactions, especially with tools like NotebookLM. Here&apos;s what you need to know:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Once you train and start prompting your notebookLM, it remembers the data sources you gave it, and any previous prompts you have entered in that chat thread </li>
              <li>This means you can ask follow-up questions and add even more context without restating all the details.</li>
              <li>The AI remembers previous questions and answers in your current session.</li>
              <li>However, context is limited to the current conversation and your uploaded sources.</li>
              <li>If you close your notebookLM tab, and reopen it, that is a new conversation; you may need to reestablish context.</li>
            </ul>
            <p className="mt-2 text-sm text-gray-700">
              Leveraging context effectively can lead to more efficient and productive interactions with the AI. It allows for more natural, flowing conversations and deeper exploration of topics.
            </p>
          </div>

          <p className="mt-4 text-lg">
            Practice interacting with NotebookLM using the Harvard AI Prompts Guide as your source. Try asking questions about effective prompting techniques or experiment with crafting your own prompts based on the guide&apos;s recommendations.
          </p>
        </section>

        {/* Step 4: Get Creative! */}
        {console.log("Step 4 begins here")}
        <section id="step4" className="step mb-12">
          <h2 className="text-3xl font-bold mb-6 text-sky-500 border-b-2 border-sky-300 pb-2">
            Step 4: Get Creative!
          </h2>

          <p className="mb-4 text-lg">
            Now that you&apos;re familiar with NotebookLM, it&apos;s time to unleash your creativity! This step is all about exploring the tool&apos;s capabilities and pushing the boundaries of what you can do with AI-assisted learning and research.
          </p>

          <div className="bg-pink-50 p-4 rounded-lg border border-pink-200 my-6">
            <h3 className="text-xl font-semibold mb-2 text-pink-800">Creative Ideas to Try</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
              <li>Summarize complex concepts: Ask NotebookLM to explain a difficult idea from your source in simpler terms.</li>
              <li>Generate examples: Request the AI to provide real-world examples of concepts mentioned in your source.</li>
              <li>Compare and contrast: Ask NotebookLM to compare different ideas or approaches mentioned in your uploaded document.</li>
              <li>Brainstorm ideas: Use the AI to help generate new ideas or applications based on the information in your source.</li>
              <li>Create study questions: Ask NotebookLM to generate quiz questions based on the content of your uploaded document.</li>
              <li>Role-play scenarios: Engage in a hypothetical dialogue where the AI takes on the role of an expert in the field your source covers.</li>
              <li>Hand-written sources: Try uploading PDFs of hand-written notes. NotebookLM will be able to understand it and it can help you review your notes!</li>
            </ul>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 my-8">
            <div className="w-full lg:w-1/2">
              <Image
                src="/images/google-notebook.jpg"
                alt="Creative AI Interaction"
                width={600}
                height={338}
                layout="responsive"
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <h3 className="text-xl font-semibold mb-4">Pushing the Boundaries</h3>
              <p className="text-lg mb-4">
                Don&apos;t be afraid to experiment with different types of prompts and questions as well as Data. The more you interact with NotebookLM, the better you&apos;ll understand its capabilities and limitations.
              </p>
              <p className="text-lg">
                Remember, the AI&apos;s responses are based on your uploaded source, so try to connect your creative prompts to the content of the Harvard AI Prompts Guide. This will help you explore both the tool&apos;s features and the guide&apos;s content in new and interesting ways.
              </p>
            </div>
          </div>

          <p className="mt-4 text-lg">
            As you get creative with NotebookLM, reflect on how this tool could enhance your learning or research process. What unique insights or perspectives can you gain by interacting with your source material in this way?
          </p>
        </section>

        {/* FINALEEE QUIZ */}
        <section className="mt-12 mb-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-sky-500">
            Now you are ready to take the{' '}
            <span className="text-blue-500">G</span>
            <span className="text-red-500">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
            {' '}<span className="text-white">NotebookLM</span> quiz!
          </h2>
          <Link href="/ai-game" passHref>
            <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
              Take the Quiz
            </button>
          </Link>
        </section>

        <Footer />
      </div>
    </>
  );
}