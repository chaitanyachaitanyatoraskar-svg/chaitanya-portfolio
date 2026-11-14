#!/usr/bin/env node

import chalk from 'chalk';
import ora from 'ora';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function typeText(text, colorFn = chalk.green, speed = 20) {
  for (const char of text) {
    process.stdout.write(colorFn(char));
    await sleep(speed);
  }
  console.log();
}

async function main() {
  console.log(); // Empty line for breathing room

  const spinner = ora({
    text: chalk.green('checking curiosity...'),
    color: 'green'
  }).start();

  await sleep(1400);

  spinner.succeed(chalk.green('curiosity confirmed.'));
  console.log();

  await sleep(800);

  await typeText("oh, so you're curious?");
  await sleep(800);

  await typeText("i respect your time, so i'll keep this short.");
  console.log();
  await sleep(800);

  await typeText("name? Chaitanya Toraskar");
  await sleep(600);
  await typeText("software engineer & data analyst");
  console.log();
  await sleep(800);

  await typeText("strengths?");
  await sleep(400);
  await typeText("▪ backend & database architecture");
  await sleep(150);
  await typeText("▪ data analytics & bi dashboards");
  await sleep(150);
  await typeText("▪ clean system design & engineering");
  console.log();
  await sleep(1000);

  await typeText("looks cool doesnt it? almost The Matrix-esque?");
  console.log();
  await sleep(1000);

  await typeText("my stack?");
  await typeText("python • django • sql • power bi • next.js • typescript • react • mysql • excel");
  console.log();
  await sleep(800);

  await typeText("proof");
  await sleep(400);

  await typeText("▪ engineered corporate web platform for Terminal Technologies (I) Pvt. Ltd.");
  await sleep(150);
  await typeText("▪ architected academic Student Management System with Django & MySQL");
  await sleep(150);
  await typeText("▪ built enterprise Power BI analytics models & ETL pipelines");
  await sleep(150);
  await typeText("▪ verified credentials from IBM (Big Data) & Anthropic (AI Foundations)");
  await sleep(150);
  await typeText("▪ instructed 50+ students in database architectures & Excel logic");
  console.log();
  await sleep(1000);

  await typeText("you want to know me MORE? ");
  await sleep(400);
  await typeText("ummmm");
  await sleep(400);
  await typeText("check my full resume & portfolio");
  console.log();
  await sleep(800);

  await typeText("also my resume.");
  await typeText("https://chaitanyachaitanyatoraskar-svg.github.io/chaitanya-portfolio/CHAITANYA-RESUME.pdf", chalk.white);
  console.log();
  await sleep(800);

  await typeText("portfolio:");
  await typeText("https://chaitanyachaitanyatoraskar-svg.github.io/chaitanya-portfolio/", chalk.white);
  console.log();
  await sleep(800);

  await typeText("github:");
  await typeText("https://github.com/chaitanyachaitanyatoraskar-svg", chalk.white);
  console.log();
  await sleep(800);

  await typeText("email: chaitanyachaitanyatoraskar@gmail.com", chalk.white);
  console.log();
  await sleep(800);

  await typeText("This is me.");
  await sleep(400);
  await typeText("Who are you?");
  console.log();
}

main().catch(console.error);
