# Lending Club Watcher

#### Hypothesis

If a user spent the time to fill out a description for their loan, they're much more likely to repay that loan than someone who didn't.

#### The Problem

There's no way to tell if a loan has a description from the loan list. Each loan needs to be individually inspected. :unamused:

#### The Solution

Push notify me when a loan with a description is found.

## Requirements

#### Accounts and API Keys for:
- Lending Club
- Pushbullet

## Usage

Start a process that checks every 10 minutes

```
npm start
```

Run the process once

```
npm run once
```

## Usage with AWS Lambda

Install and set up AWS CLI

```
brew install awscli
aws configure
```

Create a Lambda function named "LendingClubWatcher"

```
aws lambda create-function --function-name LendingClubWatcher
```

Deploy

```
npm run deploy
```
