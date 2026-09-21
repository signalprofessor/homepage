# SignalProfessor homepage

The main text lives in the small Markdown files under content. Edit those files and run npm run build. The generated static site is written to dist.

Pushes to main deploy to Loopia over FTPS after this GitHub Actions secret is configured:

- LOOPIA_FTP_PASSWORD

The workflow uses ftpcluster.loopia.se, the signalprofessor FTP user, and its scoped root directory. It does not delete remote files.
