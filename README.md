# Monopvply

description

## Installing using docker

### Requirements

  * docker
  * docker-compose

### Installing

    git clone https://github.com/epvpsyc/Monopvply monopvply -b <branch>
    cd monopvply && docker-compose up --build
    
### Updating

    docker-compose stop
    git reset --hard && git pull
    docker-compose up --build
