const projects = [
    {
    "Project": "Employee Performance & Review Dashboard",
    "Apps": [
      "Teacher PMR Dashboard"
    ],
    "Flows": [
      "Teacher PMR Mid Year Review Reminder",
      "Teacher PMR Objective Reminder",
      "Teacher PMR Final Review Reminder"
    ],
    "Features": "Enables line managers to input and monitor staff performance objectives in a centralised dashboard. A scheduled flow checks weekly for staff missing objectives and emails tailored digests to each line manager, listing only their outstanding staff. All data is centrally stored for HR access and SLT reporting. Streamlines the PMR cycle, ensures complete staff coverage, and introduces automated accountability with no manual tracking required.",
    "Planned Features": null,
    "Impact": "Transformed a chaotic, email-based objective process into a transparent performance system for over 100 teachers. Eliminates manual tracking and missed staff. Automated reminders and reporting save ~10 hours per PMR cycle, ensure 100% coverage, and create shared visibility between HR, managers, and staff.",
    "Business Use Case": "Performance Management & Oversight",
    "Category": "HR & People Ops"
  },
  {
    "Project": "Employee Development & Training Tracker",
    "Apps": [
      "Teaching & Learning Tracker"
    ],
    "Flows": [
      "Generate Observation Form from Word Template - Email to User",
      "Generate Observation Form from Word Template - Send to Teacher"
    ],
    "Features": "Centralised system for recording, reviewing, and analysing teaching observations across the school. Staff log evidence against professional teaching standards, and dashboards provide visual breakdowns by subject, department, and standard. Enables SLT and department heads to identify trends, strengths, and areas for development in real time\u2014eliminating the need for manual collation or subjective summaries during quality assurance cycles.",
    "Planned Features": null,
    "Impact": "Centralised and visualised the entire teaching observation process. Eliminated paper trails and enabled real-time visibility into teaching quality across subjects. Saves 4-6 hours of manual collation per observation cycle and empowers leaders to spot strengths and support needs at a glance.",
    "Business Use Case": "Operational Analytics & Quality Audits",
    "Category": "Reporting & Analytics"
  },
  {
    "Project": "Return to Work & Sickness Absence Management",
    "Apps": [
      "Return to Work Submission"
    ],
    "Flows": [
      "Identify Staff Returning to Work & Send Email to Complete RTW Form",
      "Check for Outstanding RTW Forms - Send Email Reminder",
      "Restrict Access to Return to Work Entries (User-Specific)"
    ],
    "Features": "Automatically checks the school\u2019s MIS daily for staff on sickness absence. If a staff member's sickness absence end date matches yesterday (or three days ago on a Monday), the system emails the staff member with a reminder to complete their return-to-work form. Daily reminders are sent until the form is completed. Upon completion, approval is sent to the business manager. The manager can confirm whether a return-to-work meeting was held, add notes, and approve the form. Once approved, a return-to-work document is generated and filed in the staff member\u2019s digital personnel file, ensuring compliance and accurate record-keeping without manual intervention.",
    "Planned Features": null,
    "Impact": "Automates the monitoring and follow-up of sickness absences. Ensures that return-to-work forms are completed on time and stored securely, reducing the risk of missed documentation. Removes manual tracking and daily reminders\u2014saving 20\u201340 minutes per case while improving accuracy and ensuring compliance with HR policies.",
    "Business Use Case": "HR Automation & Employee Services",
    "Category": "HR & People Ops"
  },
  {
    "Project": "Internal Requisitions",
    "Apps": [
      "IRO"
    ],
    "Flows": [
      "Utilise Office Scripts to Dynamically Populate an IRO Excel Template, Generates an Approval to the Budget Holder and Sends to Finance Team Once Approved"
    ],
    "Features": "A streamlined digital system for internal order placements and approvals. Staff can submit requisitions for office supplies or equipment, selecting the relevant budget holder directly within the app. The designated budget holder receives an approval request, which they can approve or reject. Once approved, the system automatically generates a branded order form, which is sent to the finance department for further processing. Users can also track the status of previous orders, providing visibility into their request history. This system eliminates manual email chains, paper forms, and ensures that all requisitions are properly tracked and documented.",
    "Planned Features": "Direct integration with budgeting software. Finance can get a live view of department budget before processing IRO",
    "Impact": "Standardises procurement by replacing unstructured email requests with a consistent, trackable workflow. Budget holders and finance staff no longer waste time chasing missing info or approvals\u2014saving 15\u201330 minutes per request and improving audit readiness.",
    "Business Use Case": "Internal Procurement & Budget Approval",
    "Category": "Internal Tools & Self-Service"
  },
  {
    "Project": "Employee Leave Management",
    "Apps": [
      "Leave of Absence"
    ],
    "Flows": [
      "Process Leave of Absence Request and Summarise Previous Absence Count by Type",
      "Summarise Previous Absence Count by Type and Return to PowerApps for User Information"
    ],
    "Features": "A straightforward app for managing staff leave requests. Staff can view their leave balances for different types of leave, with automatic adherence to leave-of-absence policies. The system generates an approval request, including the leave balance, which is sent to the business manager. The manager approves or rejects and marks the leave as paid or unpaid.",
    "Planned Features": "Direct API integration. Currently, when leave is approved, cover manager sent email with details to manually enter into school MIS. Working on API integration",
    "Impact": "Automates the entire leave request and approval process. Staff have immediate visibility of their leave balances, and managers receive streamlined requests that include all necessary information. Eliminates paper forms, manual data entry, and follow-up emails\u2014saving 15\u201330 minutes per request, improving compliance, and reducing administrative load for HR and management.",
    "Business Use Case": "HR Automation & Employee Services",
    "Category": "HR & People Ops"
  },
  {
    "Project": "External Educator & Timesheet Management",
    "Apps": [
      "Music Lesson Tracking"
    ],
    "Flows": [
      "Collate Music Lesson Data and Generate Monthly Timesheets"
    ],
    "Features": "A digital attendance and timesheet tracking system for external music teachers. Teachers select their instrument (drums, guitar, piano, singing) from a dropdown, and the system automatically displays a list of students signed up for lessons in that instrument. Teachers can mark students as present, late, or absent using tick boxes. The system tracks attendance and generates timesheets for each external teacher, simplifying payroll and administrative processes.",
    "Planned Features": null,
    "Impact": "Enables external music teachers to log attendance and generate timesheets via a simple app\u2014without needing school accounts. Replaces paper registers and manual submissions, improving accuracy and saving 10\u201315 minutes per session per teacher. Centralises attendance records for safeguarding and streamlines payment workflows.",
    "Business Use Case": "Per-User Scheduling",
    "Category": "Internal Tools & Self-Service"
  },
  {
    "Project": "Employee Onboarding & Policy Management",
    "Apps": [],
    "Flows": [
      "Generate Signed Policies From Word Template and Store in Digital Personnel File"
    ],
    "Features": "An automated onboarding package used annually for all staff. The system allows staff to complete a digital form listing updated staff policies, where they tick boxes to confirm they have read and agreed to them. The system automatically places the signed policies in the staff member's digital personnel file, and creates a new folder for new staff members. This solution replaces manual tracking, paper forms, and the need for HR to create folders for each individual.",
    "Planned Features": "Automatic deletion of files for leavers according to data retention policies",
    "Impact": "Automates annual onboarding and policy acknowledgment for ~120 staff. Staff complete a single form confirming agreement, and signed policies are stored automatically in personnel files. Eliminates paper handling and manual archiving\u2014saving several hours at the start of each year while ensuring airtight compliance.",
    "Business Use Case": "Onboarding, Policy Acknowledgement & HR Audit",
    "Category": "HR & People Ops"
  },
  {
    "Project": "Students with Special Educational Needs Management",
    "Apps": [
      "EHCP Annual Review",
      "EHCP Notes & Mentoring",
      "EHCP Review"
    ],
    "Flows": [
      "Generate EHCP LSA Annual Review",
      "Generate EHCP Teacher Review",
      "Generate Mentor Log for Selected Student",
      "Generate AI Summary of LSA Comments for Selected Student"
    ],
    "Features": "Centralised app for Learning Support Assistants (LSAs) and mentors to track support actions and outcomes. LSAs log notes on each student, referencing outcomes pre-populated by the SEN department. The app enables users to view historical notes and offers AI-driven analysis of feedback to automatically generate \"What Went Well\" (WWW) and \"Even Better If\" (EBI) summaries\u2014helpful for parent meetings or local authority discussions. For students with Education Health and Care Plans (EHCPs), teachers are prompted to complete periodic reviews, which automatically feed into the SEN department\u2019s workflow. The system ensures all notes and reviews are stored securely and accessible.",
    "Planned Features": null,
    "Impact": "Created a single record for all student support actions: LSA notes, mentoring logs, EHCP reviews, and documents. Staff no longer chase paper trails or rely on memory. Reduces duplication and confusion\u2014saving up to 1 hour per student case (in a school with 50+ EHCP students), especially during reviews or team transitions.",
    "Business Use Case": "Case Management & Support Workflows",
    "Category": "Case & Workflow Management"
  },
  {
    "Project": "Grade & Data Compliance Tracker",
    "Apps": [],
    "Flows": [
      "Notify Teachers About Missing Student Results Based on Notification Type"
    ],
    "Features": "Automated system that compares two large datasets (10,000+ rows) to identify missing student grades. The flow receives data from a Python script that cross-references results entered by teachers with those expected for each student. Automated email reminders are sent to teachers with a list of missing grades, escalating from a simple reminder to overdue notifications with escalating managerial involvement (line manager, then SLT) for unresolved cases. Ensures full grade input compliance without manual tracking or intervention.",
    "Planned Features": null,
    "Impact": "Automates the identification of missing grades for hundreds of students. Replaces manual cross-checking and bulk emails with teacher-specific alerts. Saves 2\u20134 hours per data cycle for data teams, ensures cleaner datasets, and reduces turnaround time for follow-ups.",
    "Business Use Case": "Assessment Monitoring & Data Integrity",
    "Category": "Reporting & Analytics"
  },
  
  {
    "Project": "Behaviour & Intervention Tracking System",
    "Apps": [
      "Additional Regulation Centre (ARC) Management"
    ],
    "Flows": [
      "Generate ARC Letter from PowerApps Input, Email to Parents/Carers,",
      "Exit ARC Student",
      "Send Front Office List of Students in ARC (twice, daily)"
    ],
    "Features": "A digital solution for tracking and managing student placements in the school's Additional Regulation Centre (ARC). The app gives the ARC Manager a real-time view of which students are placed in ARC each day and what work they should focus on. A flow automatically emails all relevant teachers to set special work for each student. Parents and carers are notified of the placement, including the reason for the student's inclusion in ARC. The ARC Manager uses the app to track student progress and complete their exit, generating a feedback letter from a Word template, which is sent to parents and placed in the student\u2019s file.",
    "Planned Features": null,
    "Impact": "Streamlines ARC placement from referral to communication. Automatically notifies teachers (~6 per student) to set tailored work, emails parents with placement reason, and generates exit letters filed in the student record. Replaces hours of manual coordination, follow-up, and documentation per student\u2014saving up to 30\u201360 minutes per placement while ensuring nothing is missed.",
    "Business Use Case": "Multi-Stage Case Management & Reviews",
    "Category": "Case & Workflow Management"
  },
  {
    "Project": "School Trips & Compliance Management",
    "Apps": [
      "Trip Request Form",
      "Trip Final Checklist Submission",
      "Trip Risk Assessment Submission"
    ],
    "Flows": [
      "Submit Trip Request and Multi-Stage Stakeholder Approval",
      "Review and Approve Trip Risk Assessment Documents",
      "Send Trip Final Checklist Reminder on Day of Trip",
      "Save and Share Submitted Trip Insurance Documents"
    ],
    "Features": "End-to-end digital workflow for school trip approvals involving multi-stage sign-off from line manager, cover manager, and SLT. Staff complete risk assessments and pre-trip checklists directly in the app. Automated flows route submissions to the relevant approvers, ensuring compliance with policy. Eliminates delays, paper forms, and email chasing by consolidating everything into a single, auditable workflow.",
    "Planned Features": null,
    "Impact": "Replaced a 4\u20135 step manual workflow with a fully automated system. Estimated 1.5\u20132 hours saved per trip across staff and admin teams. Improves visibility, reduces delays, and ensures risk documentation is always complete and accessible.",
    "Business Use Case": "Internal Request & Compliance Workflow",
    "Category": "Case & Workflow Management"
  },
  {
    "Project": "Enrollment & Subject Selection System",
    "Apps": [
      "6th Form Registration"
    ],
    "Flows": [],
    "Features": "A live-tracking app used during results day to manage 6th form enrolment. Teachers assist students in making their subject selections, while senior leaders have a real-time dashboard to monitor which subjects are filling up. This allows SLT to make immediate decisions on whether to halt enrolment in a subject if it reaches capacity. The system ensures seamless coordination on results day, reduces manual tracking, and provides real-time data to ensure the process runs smoothly.",
    "Planned Features": null,
    "Impact": "Gives senior leaders a live, real-time view of subject signups on results day. Replaces verbal updates and manual tallying with a digital dashboard. Enables immediate decision-making around subject caps\u2014saving hours of back-and-forth and preventing over-enrolment.",
    "Business Use Case": "Application Intake & Form Processing",
    "Category": "Intake & Forms Automation"
  },
  {
    "Project": "Automated Detention Management",
    "Apps": [],
    "Flows": [
      "Daily Detentions (See Features for More Details)"
    ],
    "Features": "Automated system for managing student detentions, pulling data from the school\u2019s MIS via HTTP request at the end of each school day. The system identifies all students who have been assigned negative behaviour points and generates a list of these students. Teachers and form tutors are automatically notified, with instructions for escorting students to the detention hall and conducting restorative conversations. Parents/carers are informed about the detention via email. A shared Excel file is generated with the list of students, which is emailed to middle leaders responsible for supervision. The system tracks attendance and, if necessary, escalates missed detentions by automatically adding students to the next day\u2019s list if they were absent previously.",
    "Planned Features": null,
    "Impact": "Automates the entire detention pipeline, from behaviour capture to escalation. Pulls data from MIS, notifies staff and parents, tracks attendance, and reassigns missed detentions automatically. Saves 30\u201360 minutes of admin time daily while ensuring consistent follow-through, transparency, and behavioural accountability.",
    "Business Use Case": "Accountability Workflow",
    "Category": "Compliance & Escalation"
  },
  {
    "Project": "Exam Appeals",
    "Apps": [
      "Exam Appeals"
    ],
    "Flows": [
      "Process Teacher Designated Appeal and Send Email to Student Requesting Consent",
      "Process Student Consent Submission, Notify Exams Officer, Add Row to Shared Exam Appeal Appeal Summary Sheet",
      "Send Reminder to Students with Outstanding Consent"
    ],
    "Features": "A streamlined system for managing exam result appeals. Teachers select students and exam components that are within the margin of error for appeals. Once identified, students are emailed to request their consent for the school to appeal on their behalf. The consent is captured through the app, which generates a unique ID and links the student directly to the relevant appeal. The system tracks consent status via a shared Excel sheet and automatically sends updates to exam officers, notifying them when consent is given. Students who have not responded are automatically reminded, ensuring no appeals are missed.",
    "Planned Features": null,
    "Impact": "Automates the consent and tracking process for exam appeals. Teachers select eligible students; students are emailed personalised links to confirm consent via the app. Responses are logged and shared with exam officers automatically. Removes the need for manual follow-up and form handling\u2014saving 20-30 minutes per appeal, improving response rates, and ensuring no eligible appeal is missed.",
    "Business Use Case": "Appeals Management & Review Workflow",
    "Category": "Case & Workflow Management"
  },
  {
    "Project": "Student Admissions & Enrollment System",
    "Apps": [],
    "Flows": [
      "Generate 6th Form Application Form, Notify 6th Form Team, Add Row to Shared Excel Application Summary Sheet, Send Email Confirmation to Applicant",
      "Email Reference Request for External Applicants",
      "Generate Year 7 Application Form, Notify Year 7 Team, Add Row to Shared Excel Application Summary Sheet, Send Email Confirmation to Applicant"
    ],
    "Features": "A digital admissions form system built on MS Forms that collects all the necessary information from prospective students and their parents. The system automatically generates an Excel file for the admissions officer with all the required data, including medical forms, which are securely stored in a shared medical area. Confirmation emails are automatically sent to students and parents. This process eliminates the need for paper forms and manual data entry, streamlining the admissions process and reducing errors.",
    "Planned Features": null,
    "Impact": "Replaced paper-based admissions with a digital process that generates structured data, notifies stakeholders, and secures medical information. Removes manual data entry and improves accuracy\u2014saving ~15\u201320 minutes per applicant and reducing risk in medical record handling.",
    "Business Use Case": "Application Management & Admin Support",
    "Category": "Intake & Forms Automation"
  },
  
  
  {
    "Project": "GCSE Options Management",
    "Apps": [
      "Year 9 Options Registration",
      "Year 9 Options Choices"
    ],
    "Flows": [
      "Monitor SP List for New Options Registration & Email Parent/Student link to User Restricted Options Choices App",
      "Identify Outstanding Options Choices & Send Email Reminder to Parent/Student",
      "Process Options Choices, Send Email Confirmation to Parent/Student"
    ],
    "Features": "A digital system for managing GCSE options selection during the Year 9 options evening. Teachers use the app to interview students and provide information about available subjects. Attendance is tracked, with students required to attend with a parent in compliance with DfE guidelines. The app is access-restricted, meaning only students who attended the options evening are able to access it. Once students make their choices, a personalised link is sent to both the student and parent to access the Options Choices app. The app uses complex logic to ensure students cannot duplicate choices and can only select subjects in approved combinations. Reminders are automatically sent to students who have not yet made their choices, and once submitted, email confirmations are sent. Data is structured for easy import into the school MIS, enabling streamlined timetable creation.",
    "Planned Features": null,
    "Impact": "Transforms the GCSE options process into a structured, validated workflow. Prevents selection errors and ensures DfE-compliant registration. Automates reminders and collects data in MIS-ready format\u2014saving 20\u201330 minutes per student and dramatically reducing administrative overhead.",
    "Business Use Case": "Choice Collection & Constraint Management",
    "Category": "Intake & Forms Automation"
  },
  {
    "Project": "Student Suspensions",
    "Apps": [
      "Generate Suspension Documents"
    ],
    "Flows": [
      "Generate Suspension Letter and Investigation Record from PowerApps Input, Notify Parents/Carers & Attendance Officers, Generate Calendar Invites for Post-Suspension Meeting"
    ],
    "Features": "A digital system for managing student suspensions. Year teams or SLT input suspension details into the app, triggering a series of automated actions. The system generates a parent letter, notifies the main office, and sends the relevant suspension data to the attendance officer for updates to the MIS. The app also generates a pre-populated investigation document for the head of year to complete. Using the app's input, the system automatically generates calendar events for SLT members holding post-suspension meetings with parents. Additionally, it schedules a two-week follow-up for SLT and head of year to ensure continued support and documentation.",
    "Planned Features": null,
    "Impact": "Automates the full suspension workflow\u2014letter generation, office and attendance notifications, MIS updates, meeting scheduling, and follow-up tracking. Replaces a fragmented process involving multiple teams\u2014saving 30\u201345 minutes per suspension while improving reliability and ensuring nothing is missed.",
    "Business Use Case": "Exclusion Reporting & Behaviour Audits",
    "Category": "Compliance & Escalation"
  }
];

export default projects;