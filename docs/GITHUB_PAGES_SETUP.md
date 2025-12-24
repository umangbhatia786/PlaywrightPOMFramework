# GitHub Pages Setup for Playwright Reports

This guide explains how to set up GitHub Pages to host your Playwright test reports.

## 📋 Prerequisites

1. Your repository must be public, or you need GitHub Pro/Team/Enterprise account for private repos
2. GitHub Pages must be enabled in your repository settings

## 🚀 Setup Steps

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select:
   - **Source**: `GitHub Actions`
5. Click **Save**

### Step 2: Verify Workflow

The workflow (`.github/workflows/playwright.yml`) is already configured to:
- Generate Playwright HTML reports in `playwright-report/` directory
- Upload the report as a Pages artifact
- Deploy it to GitHub Pages automatically

### Step 3: Access Your Reports

After the workflow runs successfully:

1. Go to the **Actions** tab in your repository
2. Click on the latest workflow run
3. Once the `deploy` job completes, you'll see a link to your GitHub Pages site
4. Or access directly at: `https://[your-username].github.io/[repository-name]/`

## 📊 Report URL Format

Your Playwright reports will be accessible at:
```
https://[your-username].github.io/[repository-name]/
```

For example:
- Repository: `PlaywrightPOMFramework`
- Username: `yourusername`
- URL: `https://yourusername.github.io/PlaywrightPOMFramework/`

## 🔄 Automatic Updates

The report is automatically updated every time you:
- Push to `main`, `master`, or `develop` branches
- Create a pull request to those branches
- Manually trigger the workflow

## 📝 Notes

- Reports are only deployed from `main`, `master`, or `develop` branches
- The workflow uses `continue-on-error: true` so reports are generated even if tests fail
- Reports are retained for 30 days as artifacts
- GitHub Pages deployment happens automatically after tests complete

## 🐛 Troubleshooting

### Reports Not Showing

1. **Check GitHub Pages Settings**: Ensure "GitHub Actions" is selected as the source
2. **Check Workflow Permissions**: The workflow needs `pages: write` permission (already configured)
3. **Check Branch**: Reports only deploy from `main`, `master`, or `develop` branches
4. **Check Workflow Run**: Ensure the `deploy` job completed successfully

### Permission Errors

If you see permission errors:
1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**

### Report Not Updating

- Wait a few minutes for GitHub Pages to update
- Clear your browser cache
- Check if the workflow run completed successfully

## 🔒 Security Note

If your repository is private, you need a GitHub Pro, Team, or Enterprise account to use GitHub Pages. For public repositories, GitHub Pages is free.

---

**Your test reports will now be accessible via a public URL! 🎉**

