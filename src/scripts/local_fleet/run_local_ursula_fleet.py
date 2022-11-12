import os

from twisted.internet import protocol
from twisted.internet import reactor


FLEET_POPULATION = 5
DEMO_NODE_STARTING_PORT = 11501
TEACHER_URI = f'127.0.0.1:11500'


def spin_up_federated_ursulas(quantity: int = FLEET_POPULATION):

    # Ports
    starting_port = DEMO_NODE_STARTING_PORT
    ports = list(map(str, range(starting_port, starting_port + quantity)))

    ursula_processes = list()
    for index, port in enumerate(ports):

        args = ['nucypher',
                'ursula', 'run',
                '--debug',
                '--rest-port', port,
                '--teacher', TEACHER_URI,
                '--federated-only',
                '--dev',
                ]

        env = {'PATH': os.environ['PATH'],
               'NUCYPHER_SENTRY_LOGS': '0',
               'NUCYPHER_FILE_LOGS': '0',
               'LC_ALL': 'en_US.UTF-8',
               'LANG': 'en_US.UTF-8'}

        childFDs = {0: 0,
                    1: 1,
                    2: 2}

        class UrsulaProcessProtocol(protocol.Protocol):

            def __init__(self, command):
                self.command = command

            def processEnded(self, reason, *args, **kwargs):
                print(reason.value)

        processProtocol = UrsulaProcessProtocol(command=args)
        p = reactor.spawnProcess(processProtocol, 'nucypher', args, env=env, childFDs=childFDs)
        ursula_processes.append(p)

    reactor.run()  # GO!


if __name__ == "__main__":
    spin_up_federated_ursulas()