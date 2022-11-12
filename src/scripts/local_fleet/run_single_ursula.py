from click.testing import CliRunner

from nucypher.cli.main import nucypher_cli
from nucypher.exceptions import DevelopmentInstallationRequired
from nucypher.utilities.networking import LOOPBACK_ADDRESS

try:
    from tests.utils.ursula import select_test_port
except ImportError:
    raise DevelopmentInstallationRequired(importable_name='tests.utils.ursula.select_test_port')

click_runner = CliRunner()

DEMO_NODE_PORT = select_test_port()
DEMO_FLEET_STARTING_PORT = 11500

args = ['ursula', 'run',
        '--debug',
        '--federated-only',
        '--teacher', f'https://{LOOPBACK_ADDRESS}:{DEMO_FLEET_STARTING_PORT}',
        '--rest-port', DEMO_NODE_PORT,
        '--dev'
        ]

nucypher_cli.main(args=args, prog_name="nucypher-cli")