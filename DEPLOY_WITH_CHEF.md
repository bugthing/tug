Tug boat Session
================

These notes from a session held on the basic use of Chef solo, where we deploy this app onto a linux machine.

Prerequisites
-------------

* Ruby
* Bundler (ruby gem)
* Amazon EC2 AMI image

SSH Config
----------

You dont *have* to spin-up a *cloud* server, you could:

* install and network a phyical machine
* configure a virtual machine (vagrant)

For quick easy access you can add the following to your ssh config file `~/.ssh/config`

```
Host tug-server
  User ec2-user
  Hostname 54.93.122.49
  IdentityFile ~/.ssh/mykey.pem
```

Lets get started
----------------

Create a directory to work in

    $ mkdir tug

Make a file named `Gemfile` with the following content:

```rb
source 'https://rubygems.org'

gem 'knife-solo'
gem 'berkshelf'
```

Install the required gems with Bundler

    bundle install

Start a Chef Solo project
-------------------------

Use knife to initialise the project, which creates some of the directories and files you will need.

    $ bundle exec knife solo init .

Now make a file named `metadata.rb` to tell Chef solo about our project

```rb
name 'tug'

depends 'nodejs'
```

We're using Berkshelf to access community cookbooks, so lets make the `Berksfile` file as we want

```rb
source "https://api.berkshelf.com"

metadata
```

We'll be making custom recipies, so lets create our own cookbook

    $ bundle exec knife cookbook create tugboat --cookbook-path=site-cookbooks


Chef Node Config
----------------

Create a JSON file called `nodes/tug-server.json` to tell Chef about our box and what to run. Give it following content:

```
{
  "run_list": [
    "nodejs"
    "tugboat"
  ]
}
```

First Chef run
--------------

We should be ready to provision our vanilla Linux machine.

First lets grab the cookbooks from Berkshelf

    $ bundle exec berks install

Now lets prepare the Linux machine

    $ bundle exec knife solo prepare tug-server

And finally, lets run the cookbooks to actually to the provisioning

    $ bundle exec knife solo cook tug-server

Subsequent Chef runs
--------------------

Now all our ducks are in a row, we can make changes to recipes, nodes, etc. then just re-provision the machine like so

    $ bundle exec knife solo cook tug-server

If you introduced any more cookbooks from the supermarket you'll need to run

    $ bundle exec berks install

Write  a recipe
---------------

Now we have an machine up and can cook upon it, it's time to do a custom recipe.

As we are just hacking, lets just start by adding ruby code into `site-cookbooks/tugboat/recipes/default.rb`, if we were
clever we'd start with specs (tests) and group different functions in different recipes.
This allows us many advantages to seperate the funtions into roles, but for now lets just add to the `default.rb`

```rb
package 'git'

file '/usr/bin/restart-tug.sh' do
  mode '0755'
  content <<SHELL
#!/bin/bash
killall node
cd /srv/tug/current
npm install
PORT=80 nohup node index.js </dev/null &>/dev/null &
SHELL
end

deploy 'tug' do
  repo 'https://github.com/bugthing/tug.git'
  deploy_to '/srv/tug'

  symlink_before_migrate.clear
  restart_command '/usr/bin/restart-tug.sh'
end
```

`package` is one of Chef's most basic methods, see more at [Chef Docs](http://docs.chef.io/search.html)

