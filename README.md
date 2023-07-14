# Kohl Tip - browser extension for tipping KohlCoin

This is a browser extension for tipping KohlCoin (now defunct) on the imageboard forum.

It was developed and tested on Chromium browser with [MetaMask](https://metamask.io/) ethereum wallet installed. Firefox has problems with MetaMask on Kohlchan ([relevant bug](https://github.com/MetaMask/metamask-extension/issues/3133)).

## Installing
- download kohltip.zip from *build* directory in this repository
- in Chrome go to: `chrome://extensions`
- enable developer mode
- click _Load unpacked_ and select the project directory
- do not delete directory with extension!
- tip some users :)

## How it works
Extenstion gets activated on predefined website and there acts as a bridge between Metamsk and host website. It works by injecting script to make the website Web3 enabled and it also changes its UI to enable blockchain tipping experience.
