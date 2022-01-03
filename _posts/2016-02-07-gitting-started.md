---
title: Under the hood with Git - What is going on?
author:
name: Cotes Chung
link: https://github.com/cotes2020
date: 2019-08-09 20:55:00 +0800
categories: [Blogging, Tutorial]
tags: [getting started]
pin: true
published: false
---

Starting a new repo can be quite tricky sometimes, and there are a number of ways you can get yourself into a mess. I'll try to explain what I can about how it works, and how you can dig yourself out.

## Manually creating one

> For the source tutorial on Github, go [here](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/). On Gitlab, go [here](https://docs.gitlab.com/ee/gitlab-basics/create-project.html).

Probably the most common way of starting off with Git is to create a repository online, and then do an initial commit and push inside your local area.

<!--more-->


1. Create a new repository on GitHub. To avoid errors, **do not initialize the new repository with README, license, or gitignore files.** You can add these files after your project has been pushed to GitHub.

2. Open Terminal.

3. Change the current working directory to your local project.

4. Initialize the local directory as a Git repository.

```
% git init
```

5. Add the files in your new local repository. This stages them for the first commit.

```
% git add .
# Adds the files in the local repository and stages them for commit. To unstage a file, use 'git reset HEAD YOUR-FILE'.
```

6. Commit the files that you've staged in your local repository.

```
% git commit -m "First commit"
# Commits the tracked changes and prepares them to be pushed to a remote repository. To remove this commit and modify the file, use 'git reset --soft HEAD~1' and commit and add the file again.
```

7. At the top of your GitHub/Gitlab repository's Quick Setup page, click  to copy the remote repository URL.

8. In Terminal, add the URL for the remote repository where your local repository will be pushed.

```
% git remote add origin <remote repository URL>
# Sets the new remote
% git remote -v
# Verifies the new remote URL
```

9. Push the changes in your local repository to GitHub/Gitlab

```
git push -u origin master
# Pushes the changes in your local repository up to the remote repository you specified as the origin
```

You will also see this around, too , which does the same.

```
git push --set-upstream origin master
```



## Push to create a project

> Introduced in Gitlab 10.5

This is actually a way neater way of creating a project locally and pushing it without leaving your terminal, and doesn't require you to create a project locally and remotely, and sync them.

You can just do either
```
## Git push using SSH
% git push --set-upstream git@gitlab.example.com:uname/nonexistent-project.git master

% git push --set-upstream git@gitlab.eps.surrey.ac.uk:wm0014/my-poem-for-cvssp.git master

## Git push using HTTP
% git push --set-upstream https://gitlab.example.com/namespace/nonexistent-project.git master
```

Alright, so... Project's finished then. Done. Programming all over. Just get beer now.

# The HEAD in Git

The ```HEAD``` is a reference to the last commit in the currently checked-out branch.

You can think of the HEAD as the "current branch". When you switch branches with git checkout, the HEAD revision changes to point to the tip of the new branch.

You can actually see what the head is doing in your local repo by running ```cat .git/HEAD```, which will output the refs/heads/master. It is possible for HEAD to refer to a specific revision that is not associated with a branch name. This situation is called a detached HEAD.

```
»  ~/Development/Poem-for-Git/Poem-for-Git git branch -a
* master
 remotes/origin/HEAD -> origin/master
 remotes/origin/master
```

```
git remote add origin <myproject.git>
```

You can prove this has been added by doing ```git remote -v``` and removing it by doing ```git remote rm origin```. You can rename the remote to anything you want - like:

```
git remote rename origin banana
```

* ```git push --set-upstream  ```

sets the default remote branch for the current local branch.

One way to avoid having to explicitly do --set-upstream is
to use the shorthand flag -u along-with the very first git push as follows

* ```git push -u origin name/of/what/to/push ```

Any future git pull command (with the current local branch checked-out),
will attempt to bring in commits from the <remote-branch> into the current local branch.
