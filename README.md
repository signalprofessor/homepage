# SignalProfessor homepage

The main text lives in the small Markdown files under content. Edit those files and run npm run build. The generated static site is written to dist.

Pushes to main deploy to Loopia over FTPS after these GitHub Actions secrets are configured:

- LOOPIA_FTP_SERVER
- LOOPIA_FTP_USERNAME
- LOOPIA_FTP_PASSWORD
- LOOPIA_FTP_PATH

LOOPIA_FTP_PATH should be the signalprofessor.com public_html path, including a trailing slash. The workflow does not delete remote files.
