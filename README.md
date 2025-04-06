# Vibecheck

## Inspiration

With the explosive rise of AI-assisted development tools like GitHub Copilot, Windsurf, and Cursor, developers are coding faster than ever. But while these tools are efficient, they’re not flawless. They often produce code that looks right but fails under the hood — especially in large codebases or in edge cases. Furthermore, today's large language models spit out faulty code with unwavering confidence, making it highly challenging to identify errors in codebases partially (or fully) developed by AI agents. At the same time, traditional coding interviews are being criticized for their disconnect from real-world software engineering as well as their credibility in hosting secure, fair interviews. These trends motivated us to build a tool that would help shape the developers of the future — developers who are resilient against programming atrophy, confident in debugging flawed AI code, and fluent in collaborating with and using AI effectively as part of their daily workflow.

## What it Does

VibeCheck is a coding practice platform where users are challenged to debug flawed AI-generated code. Each problem is derived from real outputs of Google Gemini and is categorized by topic and difficulty. Topics range from Front-End development to AI and System Administration. Users are introduced with objectives, alongside technical descriptions. Each problem begins with the overarching objectives and technical descriptions. Users are then presented with buggy AI-generated code inside a built-in code editor. For debugging, each challenge is paired with test cases that validate the submitted solution.

## How we Built It

Problem Bank: We used the NaturalCodeBench Python and Java problem sets as a base. NaturalCodeBench is a state-of-the-art dataset consisting of realistic, human-annotated coding challenges that has been used to evaluate the coding abilities of numerous LLMs. Using the Google Gemini API, we generated AI solutions, extracted failed outputs, and built a dataset of these erroneous generations. For each one, Gemini also generated titles, task descriptions, and perceived difficulty.

We used the Monaco Editor API to create a Custom IDE, which is initially populated with AI-generated code, with changes that the user must make to pass the test cases. The code editor is compatible with both Python and Java.

Frontend: We used TypeScript, React.js, and CSS for our interface. Backend: Developed with Flask and SQLAlchemy

## Challenges we Ran Into

Prompt Engineering: Getting Gemini to consistently output quality problem descriptions and ratings required careful tuning.

Workflow Integration: Seamlessly connecting code generation, test case validation, and the user-facing interface took multiple backend/frontend syncs and a lot of debugging.

Running code sandbox: We ran into multiple errors attempting to run the user-provided code in a sandbox on the server.

## Accomplishments We're Proud Of

Created an AI-driven problem-solving experience that simulates real-world debugging, rather than rote memorization.

Successfully built a robust pipeline to parse, transform, and present AI-generated code in an intuitive format.

Achieved AI model performance comparable to state-of-the-art tools at a fraction of the cost.

Built a clean and intuitive training website for users to practice challenges.

## What we Learned

The quality of developer tools hinges on clarity—both in design and in AI prompting.

Realistic coding problems must simulate real issues: misleading syntax, unclear logic, off-by-one errors, and poor variable naming.

Developers appreciate environments that don’t just hand-hold—they want to think critically and be challenged.

AI integration into software workflows needs thoughtful design, not just flashy outputs.

## What's Next

Looking ahead, we plan to expand our platform by adding more coding challenges, enhancing AI capabilities, and incorporating user feedback to improve the learning experience. We aim to build partnerships with educational institutions and tech companies to further establish VibeCheck as a go-to resource for coding interview preparation.

## References
1. NaturalCodeBench: https://arxiv.org/pdf/2405.04520
