##Backend Routes/Endpoints
Authentication
-POST /login: Authenticates users (both editors and Youtubers).
-POST /register: Registers new editors via invitation.

Video Management
-POST /video/upload: Allows editors to upload new videos.
-PUT /video/:id: Allows Youtubers to approve or reject videos.

Invitation Management
-POST /invitation/sendInvitation: Allows Youtubers to send an invitation to editors.
-POST /invitation/confirmChannel: Confirms the channel invitation for editors.

Category Management
-GET /youtube/categories: Fetches video categories from a static JSON file.

##Frontend Structure
Pages
Home.js: The main landing page of the application.
EditorLogin.js: Page for editors to log in.
YoutuberDashboard.js: Dashboard for Youtubers to manage their channels and videos.
EditorDashboard.js: Dashboard for editors to manage their video uploads.
ConfirmChannel.js: Page for editors to confirm channel invitations.
InvitationForm.js: Form for Youtubers to send invitations to editors.
EditorRegister.js: Registration page for new editors via invitation link.
Components
Header.js: Common header component.
Footer.js: Common footer component.
VideoUploadForm.js: Form component for editors to upload videos.
VideoList.js: Component to list videos with options to approve or reject.
InvitationList.js: Component to list sent invitations and their statuses.
CategoryDropdown.js: Dropdown component to select video categories.
Notification.js: Component to display success or error messages.