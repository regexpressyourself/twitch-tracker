all:
	export FLASK_APP=twitch_tracker.py && export FLASK_DEBUG=true && flask run

install: quiz_taker/frontend/package.json
	sudo pip install Flask
	sudo pip install setuptools
	pip install -e .
	cd frontend && npm install && cd ../