#!/usr/bin/env python3
import unittest
import os
import sys

# Add parent directory to path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import test modules
from test_models import ModelTestCase
from test_auth_routes import AuthRoutesTestCase
from test_template_routes import TemplateRoutesTestCase

def run_tests():
    """Run all test cases."""
    # Create the test suite
    test_suite = unittest.TestSuite()
    
    # Add test cases to the test suite
    test_suite.addTest(unittest.makeSuite(ModelTestCase))
    test_suite.addTest(unittest.makeSuite(AuthRoutesTestCase))
    test_suite.addTest(unittest.makeSuite(TemplateRoutesTestCase))
    
    # Run the tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(test_suite)
    
    return result.wasSuccessful()

if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)