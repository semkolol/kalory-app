# Contributing to Kalory

Thank you for considering contributing to Kalory, a local AI food scanner and calorie tracker, built with React-Native, Expo, TypeScript! We welcome contributions to improve the app. Please follow these guidelines to ensure a smooth process.

## Getting Started

- Read our Code of Conduct to understand our community standards.
- Check existing issues or start a discussion for questions or ideas.
- Issues labeled “help wanted” are open for contributions—view open issues.

## How to Contribute
1. **Report Bugs**:
   - Open an [issue](https://github.com/semkolol/kalory-app/issues) with:
     - A summary of the issue (e.g., app crashes on specific screen).
     - Steps to reproduce (include device/OS details if relevant).
     - Expected vs. actual behavior.
     - Notes (e.g., screenshots, device logs, or what you tried).
2. **Submit Code**:
   - Fork the repository and create a branch for your changes (e.g., `feat/add-button` or `fix/bug-name`).
   - Write clean TypeScript code following existing patterns.
   - Add or update tests for new features or bug fixes using Jest or React Native Testing Library.
   - Update documentation (e.g., README) if your changes affect app behavior or setup.
   - Submit a pull request (PR) with a clear title and description.
   - Request a review from maintainers (currently [Semir Hadzibulic or your GitHub handle]).
   - Avoid force-pushing after reviews start to preserve review history.
3. **Propose Features**:
   - Open an issue or discussion to propose new features before coding to align with project goals.

Ensure you have Node.js, React Native CLI, and appropriate emulators/simulators set up (see [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) for details).

## Style Guide

- Follow the existing code patterns
- Follow existing TypeScript and React Native patterns in the codebase.
- Use clear, descriptive variable and component names (e.g., `UserProfileScreen` instead of `Screen1`).
- Ensure type safety with TypeScript (avoid `any` types where possible).
- Format code with Prettier or ESLint (run `npm run lint` or `yarn lint` to check).
- Avoid commented-out code or unnecessary comments.

## Pull Request Process
1. Include screenshots or screen recordings for UI changes (e.g., new screens or components).
2. Submit your PR with a clear description of changes.
3. Request a review from maintainers.
4. We’ll merge once approved by at least one maintainer.

## Commit Messages
We use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format:
```
type(scope): title
description
```
- **Types**: `feat` (new feature), `fix` (bug fix), `docs` (documentation), `test` (tests), `refactor` (code improvements), `chore` (maintenance).
- **Example**:
  ```
  feat(ui): add dark mode toggle
  Added a toggle component for dark mode in the settings screen.
  ```

## License
By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE.md).

## Questions?
Reach out via [GitHub issues](https://github.com/semkolol/kalory-app/issues) or contact [brodveystudio@gmail.com]. As a small project, reviews may take a few days—thanks for your patience!